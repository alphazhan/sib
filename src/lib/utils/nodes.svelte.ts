import type { SelectedNodedge, WaterSystemEdge, WaterSystemNode } from './node_types';
import { writable } from 'svelte/store';

const initialNodes: WaterSystemNode[] = [
	{
		id: 'river-source',
		type: 'river',
		data: {
			label: 'Река (Источник)',
			properties: {
				'Тип источника': 'Поверхностные воды',
				'Уровень воды': 'Переменный'
			}
		},
		position: { x: 300, y: 50 }
	},
	{
		id: 'pump-1',
		type: 'pump_station',
		data: {
			label: 'Насосная станция',
			properties: {
				Производительность: '100 л/с',
				Напор: '20 м',
				Мощность: '30 кВт'
			}
		},
		position: { x: 300, y: 200 }
	},
	{
		id: 'drinking-tank-1',
		type: 'drinking_water_tank',
		data: {
			label: 'Резервуар питьевой воды',
			properties: {
				Объём: '2000 м³',
				Давление: '3 бар'
			}
		},
		position: { x: 300, y: 350 }
	},
	{
		id: 'plot-outlet-1',
		type: 'sedimentation_tank',
		data: {
			label: 'Отстойник (Сельхозучасток)',
			properties: {
				Объём: '300 м³',
				'Время отстаивания': '2 ч'
			}
		},
		position: { x: 300, y: 500 }
	},
	{
		id: 'river-outlet',
		type: 'river',
		data: {
			label: 'Река (Сброс)',
			properties: {
				'Тип источника': 'Поверхностные воды',
				'Уровень воды': 'Переменный'
			}
		},
		position: { x: 300, y: 650 }
	}
];

// Edges
const initialEdges: WaterSystemEdge[] = [
	{
		id: 'e-river-to-pump',
		source: 'river-source',
		target: 'pump-1',

		data: {
			properties: {
				'Скорость потока': 100,
				'Потери на трение': 0.03
			}
		}
	},
	{
		id: 'e-pump-to-tank',
		source: 'pump-1',
		target: 'drinking-tank-1',

		data: {
			properties: {
				'Скорость потока': 100,
				'Потери на трение': 0.05
			}
		}
	},
	{
		id: 'e-tank-to-plot',
		source: 'drinking-tank-1',
		target: 'plot-outlet-1',
		data: {
			properties: {
				'Скорость потока': 100,
				'Потери на трение': 0.04
			}
		}
	},
	{
		id: 'e-plot-to-outlet',
		source: 'plot-outlet-1',
		target: 'river-outlet',
		data: {
			properties: {
				'Скорость потока': 80,
				'Потери на трение': 0.01
			}
		}
	}
];

// Create stores for nodes and edges
export const nodes = writable<WaterSystemNode[]>(initialNodes);
export const edges = writable<WaterSystemEdge[]>(initialEdges);

// Store for the currently selected node
export let selectedNodeRef = $state({ value: null as SelectedNodedge | null });
