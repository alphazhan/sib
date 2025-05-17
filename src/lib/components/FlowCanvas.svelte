<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteFlow, Background, Controls, MiniMap } from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import { nodes, edges, selectedNodeRef } from '$utils/nodes.svelte';
	import { createNodeFromType, nodeTypes } from '$utils/node_types';
	import BaseNode from './BaseNode.svelte';
	import { settings } from '$utils/states.svelte';

	// Component map for SvelteFlow
	const nodeTypesFlow = Object.fromEntries(nodeTypes.map(({ type }) => [type, BaseNode]));

	// Handle node changes
	function onNodesChange(changes: any[]) {
		// Apply changes manually since applyNodeChanges is not available
		changes.forEach((change) => {
			if (change.type === 'remove') {
				$nodes = $nodes.filter((node) => node.id !== change.id);
			} else if (change.type === 'position') {
				$nodes = $nodes.map((node) => {
					if (node.id === change.id) {
						return { ...node, position: change.position };
					}
					return node;
				});
			} else if (change.type === 'select') {
				$nodes = $nodes.map((node) => {
					if (node.id === change.id) {
						return { ...node, selected: change.selected };
					}
					return node;
				});
			}
		});
	}

	// Handle edge changes
	function onEdgesChange(changes: any[]) {
		// Apply changes manually since applyEdgeChanges is not available
		changes.forEach((change) => {
			if (change.type === 'remove') {
				$edges = $edges.filter((edge) => edge.id !== change.id);
			} else if (change.type === 'select') {
				$edges = $edges.map((edge) => {
					if (edge.id === change.id) {
						return { ...edge, selected: change.selected };
					}
					return edge;
				});
			}
		});
	}

	// Handle drop event for creating new nodes
	function onDrop(event: DragEvent) {
		event.preventDefault();

		if (event.dataTransfer) {
			let nodeType = event.dataTransfer.getData('application/svelteflow');

			if (nodeType) {
				// Get the drop position
				const reactFlowBounds = document.querySelector('.svelte-flow')?.getBoundingClientRect();

				if (reactFlowBounds && event.clientX && event.clientY) {
					const position = {
						x: event.clientX - reactFlowBounds.left,
						y: event.clientY - reactFlowBounds.top
					};

					// Create a new node
					const newNode = createNodeFromType(nodeType, position);
					$nodes = [...$nodes, newNode];
				}
			}
		}
	}

	// Handle drag over event
	function onDragOver(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}
	}

	// Initialize dark mode from localStorage on mount
	onMount(() => {
		const darkMode = localStorage.getItem('darkMode');
		if (darkMode === 'true') {
			document.documentElement.classList.add('dark');
		}
	});
</script>

<SvelteFlow
	{nodes}
	{edges}
	nodeTypes={nodeTypesFlow as any}
	style="background: ${settings.darkMode ? '#1f2937' : '#f3f4f6'}"
	on:nodeschange={(e) => onNodesChange(e.detail)}
	on:edgeschange={(e) => onEdgesChange(e.detail)}
	on:edgeclick={(e) => {
		// Handle edge click event
		const { id, type, data, selected } = e.detail.edge;
		selectedNodeRef.value = {
			id,
			type,
			label: 'Поток',
			properties: data,
			position: { x: 0, y: 0 },
			selected
		};
	}}
	on:drop={onDrop}
	on:dragover={onDragOver}
	defaultEdgeOptions={{
		type: 'water',
		style: 'stroke: #3b82f6; stroke-width: 2px',
		animated: true,
		labelStyle: 'font-size: 12px; fill: #333'
	}}
	fitView
	class="bg-gray-100 dark:bg-gray-800"
	connectionLineStyle="stroke: #3b82f6; stroke-width: 2"
>
	<Background />
	<Controls />
	<MiniMap />
</SvelteFlow>
