import { error, json } from '@sveltejs/kit';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { OPENAI_API_KEY, GEMINI_API_KEY } from '$env/static/private';

const openai_client = new OpenAI({ apiKey: OPENAI_API_KEY });
const gemini_client = new GoogleGenerativeAI(GEMINI_API_KEY);

function getPrompt(data: any) {
	return `
Expert in water/wastewater systems for SIB project. Analyze input (JSON/text), identify issues (pump capacity, clarifier size, overload, friction losses, treatment efficiency), provide Russian solutions with calculations, return modified JSON system.

**Input Format**
- **JSON**: nodes [{id: string, type: string, data: {label: string, properties: {[key: string]: string}}, position: {x: number, y: number}}], edges [{id: string, source: string, target: string, data: {flowRate: number, frictionLoss: number}}]
- **Text**: Components →, params in (), e.g., Дом → Канализационный коллектор (600 л/с)

**Requirements**
- **Analysis**: Pumps (Производительность < flow), clarifiers (Объём < flow × time), overload (flow > capacity), pipes (frictionLoss > 0.05 bar), aerotanks (volume/oxygen issues).
- **Output**: Strict JSON: {suggestions: string[], modified: {nodes: [], edges: []}}
- **Russian**: suggestions, data.label (e.g., "Насосная станция"), data.properties (e.g., "Производительность": "100 л/с").
- **Node Types**: Use only predefined palette types. No new types.
- **Predefined System Palette Types**: pump_station, sewage_collector, drinking_water_tank, grates, filter, sand_trap, primary_sedimentation_tank, aerotank, sedimentation_tank, mixer, water_intake, secondary_sedimentation_tank, river, house
- **Modified JSON**: Add, modify, remove nodes (palette only) and edges if needed, optimize properties, preserve id, type, data.label, position.
- **Parameters**: Pumps: 50–2000 l/s (wastewater), 500–2000 l/h (irrigation); Clarifiers: 100–1000 m³, 1–4 h; Tanks: 500–2000 m³; Aerotanks: 500–5000 m³, oxygen 2–4 mg/l.

**Example 1: Increase Water Supply to 120 l/s**
- **Input (Text)**: Водоприемники (50 л/с) → Насосная станция (30 кВт) → Резервуар питьевой воды (2000 м³) → Фильтры (8 м/ч) → Отстойники (300 м³, 2 ч) → Смесители (50 м³) → Канализационный коллектор (500 л/с) → Насосная станция (100 л/с) → Решётки (200 л/с) → Песколовки (20 м³) → Первичные отстойники (400 м³, 1.5 ч) → Аэротенки (1000 м³) → Вторичные отстойники (500 м³, 2 ч) → Река
- **Issues**: Water intake (50 l/s < 120 l/s: cavitation); supply pump (30 kW: overload); clarifiers (300 m³, 2 h: 864 m³ needed, ~41.7 min); wastewater pump (100 l/s < 120 l/s: overflow); aerotanks (1000 m³: ~2.31 h, low efficiency).
- **Output**: Suggestions: Increase water intake to 120 л/с, replace supply pump with 50 кВт, clarifiers to 900 m³, wastewater pump to 120 л/с, aerotanks to 1500 m³. Modified: Update nodes (water_intake, pump_station, sedimentation_tank, aerotank) with new properties, preserve others, adjust edges for 120 l/s flow.

**Example 2: Reduce Aerotank Volume to 600 m³**
- **Input (Text)**: Канализационный коллектор (500 л/с) → Насосная станция (100 л/с) → Решётки (200 л/с) → Песколовки (20 м³) → Первичные отстойники (400 м³, 1.5 ч) → Аэротенки (600 м³, Кислород 2 мг/л) → Вторичные отстойники (500 м³, 2 ч) → Река
- **Issues**: Aerotank (600 m³, 100 l/s: ~1.67 h vs. 2.78 h, low treatment, high BOD); oxygen (2 mg/l: insufficient); secondary clarifiers (500 m³: high organic load, poor effluent).
- **Output**: Suggestions: Increase aerotanks to 1000 m³, oxygen to 3 mg/l, add drinking_water_tank (500 m³) before aerotanks. Modified: Add drinking_water_tank node, update aerotank properties, adjust edges.

**Output Instructions**:
- Do *not* add any comments and return **strict JSON** with the following structure:
{
  "suggestions": ["string", ...], // In Russian, e.g., "Уменьшить поток в коллектор до 100 л/с"
  "modified": {
    "nodes": [{ /* Node structure */ }, ...],
    "edges": [{ /* Edge structure */ }, ...]
  }
}
- Use Russian for:
  - suggestions (all strings).
  - data.label (e.g., "Насосная станция").
  - data.properties keys and values (e.g., "Производительность": "100 л/с").

**Input Data**:
${JSON.stringify(data, null, 2)}
`;
}

// Remove ```json and ``` (triple backticks) markers from a string if present
function stripJsonMarkers(input: string): string {
	const jsonStart = '```json\n';
	const jsonEnd = '\n```';

	if (
		input.startsWith(jsonStart) &&
		input.endsWith(jsonEnd) &&
		input.length > jsonStart.length + jsonEnd.length
	) {
		return input.slice(jsonStart.length, -jsonEnd.length).trim();
	}

	return input;
}

async function generateResponse(prompt: string, model: string) {
	// OpenAI
	if (model.startsWith('gpt')) {
		// Call OpenAI API
		const response = await openai_client.chat.completions.create({
			model, // 'gpt-4o-mini'
			messages: [
				{ role: 'system', content: 'Вы — эксперт по системам водоснабжения.' },
				{ role: 'user', content: prompt }
			],
			max_tokens: 2000,
			temperature: 0.7
		});

		return response.choices[0].message.content;
	}
	// Gemini AI
	else if (model.startsWith('gemini')) {
		const gemini_model = gemini_client.getGenerativeModel({ model }); // 'gemini-1.5-pro'
		const result = await gemini_model.generateContent(prompt);
		const response = await result.response;
		return response.text();
	}
}

export async function POST({ request }) {
	try {
		const data = await request.json();

		// Validate JSON structure
		if (
			!data.nodes ||
			!Array.isArray(data.nodes) ||
			!data.edges ||
			!Array.isArray(data.edges) ||
			!data.model
		) {
			console.error('POST /api/ai: Invalid JSON structure');
			throw new Error(
				'Неверный формат JSON: ожидается объект с полями "nodes" и "edges" (массивы) и ИИ-модель.'
			);
		}

		const prompt = getPrompt(data);

		console.log('Generating answer...');

		// Call OpenAI or Gemini API
		const response = await generateResponse(prompt, data.model);

		// console.log('AI response:', response);

		const result = JSON.parse(stripJsonMarkers(response ?? ''));

		// Validate response
		if (
			!result.suggestions ||
			!Array.isArray(result.suggestions) ||
			!result.modified ||
			!result.modified.nodes ||
			!result.modified.edges
		) {
			throw new Error(
				'Неверный ответ от ИИ: ожидается объект с suggestions (массив) и modified (объект с nodes и edges).'
			);
		}

		return json(result);
	} catch (err) {
		console.log('server side error', err);
		throw error(400, (err as any).message);
	}
}
