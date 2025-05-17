<script lang="ts">
	import { Accordion, AccordionItem, Button, Modal, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { Spinner } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import { edges, nodes } from '$utils/nodes.svelte';
	import { get } from 'svelte/store';

	// Interface for AI response
	interface AIResponse {
		suggestions: string[];
		modified: { nodes: any[]; edges: any[] };
	}

	// State
	let isLoading = $state(false);
	let showModal = $state(false);
	let suggestions = $state<string[]>([]);
	let pendingChanges = $state<AIResponse | null>(null);
	let selectedModel = $state('gemini-1.5-pro'); // Default model

	// Available AI models
	const models = [
		{ id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
		{ id: 'gpt-4o-mini', name: 'ChatGPT (GPT-4o Mini)' }
	];

	// Optimize with AI
	async function optimizeWithAI() {
		isLoading = true;
		try {
			const response = await fetch('/api/ai', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					nodes: get(nodes),
					edges: get(edges),
					model: selectedModel // Include selected model
				})
			});

			if (!response.ok) throw new Error('Ошибка при обращении к ИИ.');
			const result = await response.json();
			pendingChanges = result;
			suggestions = result.suggestions;
			showModal = true; // Show confirmation modal
		} catch (error) {
			alert(`Ошибка: ${error}`);
		} finally {
			isLoading = false;
		}
	}

	// Apply AI changes
	function applyChanges() {
		if (pendingChanges) {
			$nodes = pendingChanges.modified.nodes;
			$edges = pendingChanges.modified.edges;
		}
		showModal = false;
		pendingChanges = null;
	}

	// Cancel changes
	function cancelChanges() {
		showModal = false;
		pendingChanges = null;
	}
</script>

<div>
	<!-- Suggestions Accordion -->
	{#if suggestions.length > 0}
		<Accordion
			class="mt-4 max-h-96 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700"
		>
			<AccordionItem>
				<span slot="header" class="font-semibold text-blue-600 dark:text-blue-500">
					SIB-AI Предложения
				</span>
				<div class="p-4">
					<h4 class="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Рекомендации:</h4>
					<ul class="list-disc space-y-2 pl-5 text-gray-700 dark:text-gray-300">
						{#each suggestions as suggestion}
							<li class="text-md">{suggestion}</li>
						{/each}
					</ul>
				</div>
			</AccordionItem>
		</Accordion>
	{/if}

	<!-- AI Optimization Button and Model Dropdown -->
	<div class="mt-4 flex gap-2">
		<Button color="primary" class="flex-1" size="xl" on:click={optimizeWithAI} disabled={isLoading}>
			{#if isLoading}
				<Spinner class="mr-4" size={8} />

				Оптимизация...
			{:else}
				Оптимизировать с ИИ
			{/if}
		</Button>
		<Button color="light" size="md" class="flex w-36 items-center gap-2" disabled={isLoading}>
			<span class="truncate">{models.find((m) => m.id === selectedModel)?.name}</span>
			<ChevronDownOutline class="h-4 w-4" />
		</Button>
		<Dropdown class="z-50 w-36">
			{#each models as model}
				<DropdownItem
					on:click={() => (selectedModel = model.id)}
					class={selectedModel === model.id ? 'bg-blue-100 dark:bg-blue-900' : ''}
				>
					{model.name}
				</DropdownItem>
			{/each}
		</Dropdown>
	</div>
</div>

<!-- Confirmation Modal -->
<Modal bind:open={showModal} size="md" autoclose={false} class="rounded-xl">
	<div class="p-6 text-center">
		<h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
			Применить изменения от SIB-AI?
		</h3>
		<p class="mb-6 text-base text-gray-600 dark:text-gray-400">
			ИИ предложил {suggestions.length} рекомендаций и изменения в системе. Применить их?
		</p>
		<div class="flex justify-center gap-4">
			<Button color="primary" on:click={applyChanges}>Применить</Button>
			<Button color="alternative" on:click={cancelChanges}>Отмена</Button>
		</div>
	</div>
</Modal>
