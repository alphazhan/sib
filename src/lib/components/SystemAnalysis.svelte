<script lang="ts">
	import type { WaterSystemEdge, WaterSystemNode } from '$utils/node_types';
	import { edges, nodes, selectedNodeRef } from '$utils/nodes.svelte';
	import { FloatingLabelInput } from 'flowbite-svelte';
	import { get } from 'svelte/store';

	function isEdge(item: WaterSystemNode | WaterSystemEdge): item is WaterSystemEdge {
		return 'source' in item && 'target' in item;
	}

	function updateProperty(key: string, value: string, isEdge: boolean) {
		if (isEdge) {
			edges.update((items) =>
				items.map((item) =>
					item.id === selectedNodeRef.value?.id
						? ({
								...item,
								data: {
									...item.data,
									properties: {
										...item.data.properties,
										[key]: value
									}
								}
							} satisfies WaterSystemEdge)
						: item
				)
			);
		} else {
			nodes.update((items) =>
				items.map((item) =>
					item.id === selectedNodeRef.value?.id
						? ({
								...item,
								data: {
									...item.data,
									properties: {
										...item.data.properties,
										[key]: value
									}
								}
							} satisfies WaterSystemNode)
						: item
				)
			);
		}
	}
</script>

<div class="flex flex-col gap-4">
	<h2 class="text-xl font-bold text-gray-800 dark:text-white">System Analysis</h2>

	{#if selectedNodeRef.value}
		<div class="mb-4">
			<h3 class="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
				{selectedNodeRef.value.data?.label ?? 'Поток воды'}
			</h3>
			<div class="mb-4 rounded-md bg-gray-100 p-3 dark:bg-gray-700">
				<h4 class="mb-4 text-sm font-medium text-gray-600 dark:text-gray-400">Properties</h4>
				<ul class="space-y-8">
					{#each [...get(nodes), ...get(edges)].filter((n) => n.id === selectedNodeRef.value!.id) as item}
						<ul class="space-y-8">
							{#each Object.entries(item.data?.properties ?? {}) as [key, value], index}
								<FloatingLabelInput
									id={`prop-${index}`}
									placeholder="Введите значение"
									{value}
									on:input={(e) =>
										e.target?.value != null && updateProperty(key, e.target.value, isEdge(item))}
									class="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600"
									color="base"
								>
									{key}
								</FloatingLabelInput>
							{/each}
						</ul>
					{/each}
				</ul>
			</div>
		</div>
	{:else}
		<div class="rounded-md bg-gray-100 p-4 text-center dark:bg-gray-700">
			<p class="text-gray-600 dark:text-gray-400">
				Select a component from the canvas to view its properties and get AI optimization
				suggestions.
			</p>
		</div>
	{/if}
</div>
