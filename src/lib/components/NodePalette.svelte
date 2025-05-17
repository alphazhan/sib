<script lang="ts">
	import { Card, Button } from 'flowbite-svelte';
	import { ChevronLeftOutline, ChevronRightOutline } from 'flowbite-svelte-icons';
	import { nodeTypes } from '$utils/node_types';
	import { onDestroy } from 'svelte';

	let carouselContainer: HTMLElement;

	function scrollLeft() {
		if (carouselContainer) {
			carouselContainer.scrollBy({ left: -120, behavior: 'smooth' });
		}
	}

	function scrollRight() {
		if (carouselContainer) {
			carouselContainer.scrollBy({ left: 120, behavior: 'smooth' });
		}
	}

	// Update button states for start/end of carousel
	let isAtStart = true;
	let isAtEnd = false;

	function updateButtonState() {
		if (carouselContainer) {
			isAtStart = carouselContainer.scrollLeft === 0;
			isAtEnd =
				carouselContainer.scrollLeft + carouselContainer.clientWidth >=
				carouselContainer.scrollWidth - 1;
		}
	}

	// Add scroll event listener
	$: if (carouselContainer) {
		carouselContainer.addEventListener('scroll', updateButtonState);
	}

	// Event handler for drag start
	function handleDragStart(event: DragEvent, nodeType: string) {
		if (event.dataTransfer) {
			event.dataTransfer.setData('application/svelteflow', nodeType);
			event.dataTransfer.effectAllowed = 'move';
		}
	}

	// Cleanup on component destroy
	onDestroy(() => {
		if (carouselContainer) {
			carouselContainer.removeEventListener('scroll', updateButtonState);
		}
	});
</script>

<Card class="mx-auto mb-2 max-w-5/9 px-4 py-4">
	<h3 class="mb-4 text-center text-lg font-semibold text-gray-800 dark:text-white">
		Компоненты системы водоснабжения
	</h3>

	<div class="relative px-6 sm:px-8">
		<div
			class="scroll-snap-type-x mandatory overflow-x-auto scroll-smooth"
			bind:this={carouselContainer}
		>
			<div class="flex gap-3 sm:gap-4">
				{#each nodeTypes as nodeType (nodeType.label)}
					<div
						class="scroll-snap-align-start flex w-[80px] flex-shrink-0 flex-col items-center rounded-md border-2 border-gray-300 bg-gray-100 p-2 hover:bg-gray-200 sm:w-[100px] dark:border-transparent dark:bg-gray-700 dark:hover:bg-gray-700"
						draggable="true"
						role="button"
						tabindex="0"
						aria-label="Drag {nodeType.label} component"
						on:dragstart={(e) => handleDragStart(e, nodeType.type)}
					>
						<div
							class="mb-1 text-xl sm:text-2xl"
							title={`${nodeType.label}: ${Object.entries(nodeType.properties)
								.map(([key, value]) => `${key}: ${value}`)
								.join(', ')}`}
						>
							{nodeType.icon}
						</div>
						<span class="text-center text-xs font-medium text-gray-700 dark:text-gray-300">
							{nodeType.label}
						</span>
					</div>
				{/each}
			</div>
		</div>
		<Button
			class="absolute top-1/2 left-0 -translate-x-2 -translate-y-1/2 transform touch-manipulation rounded-full bg-white p-2 disabled:opacity-50 dark:bg-gray-800"
			on:click={scrollLeft}
			disabled={isAtStart}
			aria-label="Previous components"
		>
			<ChevronLeftOutline class="h-4 w-4 text-gray-600 dark:text-gray-300" />
		</Button>
		<Button
			class="absolute top-1/2 right-0 translate-x-2 -translate-y-1/2 transform touch-manipulation rounded-full bg-white p-2 disabled:opacity-50 dark:bg-gray-800"
			on:click={scrollRight}
			disabled={isAtEnd}
			aria-label="Next components"
		>
			<ChevronRightOutline class="h-4 w-4 text-gray-600 dark:text-gray-300" />
		</Button>
	</div>
</Card>
