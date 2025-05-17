import { type Node, type Edge, Position } from '@xyflow/svelte';

// Define types for our water system components
export type NodeType = 'pump' | 'pipe' | 'tank' | 'sprinkler' | 'reservoir' | 'plot';

// Nodedge stands for node + edge
export interface SelectedNodedge extends Node {
	id: string;
	type: NodeType | string;
	data: {
		label: string;

		properties: {
			[key: string]: string | number;
		};
	};
}

export interface WaterSystemNode extends Node {
	type: NodeType | string;
	data: {
		label: string;
		properties: {
			[key: string]: string | number;
		};
	};
	deletable?: boolean;
	selectable?: boolean;
	draggable?: boolean;
	zIndex?: number;
	dragging?: boolean;
}

export interface WaterSystemEdge extends Edge {
	type?: 'water';
	data: {
		properties?: {
			[key: string]: string | number;
			// flowRate?: number; // L/h
			// frictionLoss?: number; // calculated via Hazen-Williams equation
		};
	};
}

// Define type for node palette items
export interface NodePaletteItem {
	type: string;
	label: string;
	properties: { [key: string]: string | number };
	icon: string;
}

// Node types for the palette
export const nodeTypes: NodePaletteItem[] = [
	{
		type: 'pump_station',
		label: 'Насосная станция',
		properties: {
			Производительность: '100 л/с',
			Напор: '20 м',
			Мощность: '30 кВт'
		},
		icon: '💧⚙'
	},
	{
		type: 'sewage_collector',
		label: 'Канализационный коллектор',
		properties: {
			Диаметр: '1000 мм',
			'Пропускная способность': '500 л/с'
		},
		icon: '🛢'
	},
	{
		type: 'drinking_water_tank',
		label: 'Резервуар питьевой воды',
		properties: {
			Объём: '2000 м³',
			Давление: '3 бар'
		},
		icon: '🛢💧'
	},
	{
		type: 'grates',
		label: 'Решётки',
		properties: {
			'Размер щели': '10 мм',
			'Пропускная способность': '200 л/с'
		},
		icon: '🔲'
	},
	{
		type: 'filter',
		label: 'Фильтр',
		properties: {
			Тип: 'песчаный',
			'Скорость фильтрации': '8 м/ч'
		},
		icon: '🧽'
	},
	{
		type: 'sand_trap',
		label: 'Песколовка',
		properties: {
			Объём: '20 м³',
			'Скорость потока': '0.3 м/с'
		},
		icon: '🏖'
	},
	{
		type: 'primary_sedimentation_tank',
		label: 'Первичный отстойник',
		properties: {
			Объём: '400 м³',
			'Время отстаивания': '1.5 ч'
		},
		icon: '🔄'
	},
	{
		type: 'aerotank',
		label: 'Аэротенк',
		properties: {
			Объём: '1000 м³',
			'Концентрация кислорода': '2 мг/л'
		},
		icon: '🌬💧'
	},
	{
		type: 'sedimentation_tank',
		label: 'Отстойник',
		properties: {
			Объём: '300 м³',
			'Время отстаивания': '2 ч'
		},
		icon: '🧱💦'
	},
	{
		type: 'mixer',
		label: 'Смеситель',
		properties: {
			Объём: '50 м³',
			'Время смешивания': '5 мин'
		},
		icon: '🔄💧'
	},
	{
		type: 'water_intake',
		label: 'Водоприемник',
		properties: {
			Дебит: '50 л/с',
			Глубина: '2.5 м'
		},
		icon: '🌊📥'
	},
	{
		type: 'secondary_sedimentation_tank',
		label: 'Вторичный отстойник',
		properties: {
			Объём: '500 м³',
			'Время отстаивания': '2 ч'
		},
		icon: '🌀'
	},
	{
		type: 'river',
		label: 'Река',
		properties: {
			'Тип источника': 'Поверхностные воды',
			'Уровень воды': 'Переменный'
		},
		icon: '🌊'
	},
	{
		type: 'house',
		label: 'Дом',
		properties: {
			'Потребление воды': '500 л/день',
			'Количество жильцов': '4 человека'
		},
		icon: '🏠'
	}
];

// Function to create a new node from a node type
export function createNodeFromType(
	type: string,
	position: { x: number; y: number }
): WaterSystemNode {
	const nodeType = nodeTypes.find((nt) => nt.type === type);
	if (!nodeType) throw new Error(`Node type ${type} not found`);

	return {
		id: `${type}-${Date.now()}`,
		type,
		data: {
			label: nodeType.label,
			properties: { ...nodeType.properties } as { [key: string]: string | number }
		},
		position,
		sourcePosition: Position.Right,
		targetPosition: Position.Left
	};
}
