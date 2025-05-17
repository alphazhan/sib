<script lang="ts">
	import '../app.css';

	import { settings } from '$utils/states.svelte';

	let { children } = $props();
</script>

<div class="flex h-screen flex-col" class:dark={settings.darkMode}>
	{@render children()}
</div>
