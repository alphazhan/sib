<script lang="ts">
	import NavBar from '$components/NavBar.svelte';
	import FlowCanvas from '$components/FlowCanvas.svelte';
	import NodePalette from '$components/NodePalette.svelte';
	import SystemAnalysis from '$components/SystemAnalysis.svelte';
	import AiChat from '$components/AIChat.svelte';
</script>

<!-- Navigation Bar -->
<NavBar />

<!-- Main Content -->
<div class="flex flex-1 overflow-hidden">
	<!-- Left Panel (80%) - Svelte Flow Canvas -->
	<div class="relative w-4/5">
		<!-- Svelte Flow Canvas -->
		<FlowCanvas />

		<!-- Node Palette -->
		<div class="absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
			<NodePalette />
		</div>
	</div>

	<!-- Right Sidebar (20%) - System Analysis -->
	<div
		class="flex w-1/5 flex-col justify-between overflow-y-auto border-l border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
	>
		<SystemAnalysis />

		<!-- AI Dialogue -->
		<AiChat />
	</div>
</div>
