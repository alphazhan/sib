<script lang="ts">
	import { Handle } from '@xyflow/svelte';
	import { Position } from '@xyflow/svelte';
	import { selectedNodeRef } from '$utils/nodes.svelte';
	import { nodeTypes } from '$utils/node_types';

	// Required props for SvelteFlow nodes
	let {
		id,
		type,
		data,
		selected = false,
		deletable = true,
		selectable = true,
		draggable = true,
		zIndex = 0,
		dragging = false
	} = $props();

	// Sync selected node to shared state when this node is selected
	$effect(() => {
		if (selected) {
			selectedNodeRef.value = {
				id,
				type,
				data,
				position: { x: 0, y: 0 },
				selected
			};
		}
	});
</script>

<div
	class={`rounded-md border-2 p-3 shadow-md ${selected ? 'border-blue-500' : 'border-gray-300'} 
  min-w-[150px] bg-white dark:border-gray-600 dark:bg-gray-800`}
>
	<div class="mb-1 flex items-center">
		<!-- Node icon -->
		<div class="text-2xl">{nodeTypes.find((nt) => nt.type === type)?.icon}</div>

		<!-- Node label -->
		<div class="ml-1 font-semibold text-gray-800 dark:text-white">{data.label}</div>
	</div>

	<div class="text-xs text-gray-600 dark:text-gray-300">
		{#each Object.entries(data.properties).slice(0, 2) as [key, value], i}
			<div>{key}: {value}</div>
		{/each}
		{#if Object.keys(data.properties).length > 2}
			<div class="text-gray-500 dark:text-gray-400">...</div>
		{/if}
	</div>

	<!-- Source handle (bottom side) -->
	<Handle type="source" position={Position.Bottom} style="width: 12px; height: 12px" />

	<!-- Target handle (top side) -->
	<Handle type="target" position={Position.Top} style="width: 12px; height: 12px" />
</div>
