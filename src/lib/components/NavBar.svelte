<script lang="ts">
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import {
		SunOutline,
		MoonOutline,
		FileExportOutline,
		FileImportOutline
	} from 'flowbite-svelte-icons';
	import { settings } from '$utils/states.svelte';
	import { edges, nodes } from '$utils/nodes.svelte';

	const toggleDarkMode = () => {
		settings.darkMode = !settings.darkMode;
	};

	const onExport = (minify: boolean = true) => {
		try {
			// Create JSON object
			const data = {
				nodes: $nodes,
				edges: $edges
			};

			// Format JSON: minified or pretty-printed
			const jsonString = minify ? JSON.stringify(data) : JSON.stringify(data, null, 2);

			// Generate filename with current date and time (e.g., 2025-04-18_14-30)
			const now = new Date();
			const dateStr = now.toISOString().slice(0, 16).replace('T', '_').replace(':', '-');
			const filename = `sib_${dateStr}.json`;

			// Create Blob and trigger download
			const blob = new Blob([jsonString], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} catch (error) {
			alert('Ошибка при экспорте');
		}
	};

	const onImport = (event: Event) => {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) {
			alert('Пожалуйста, выберите JSON-файл.');
			return;
		}

		// Validate file type
		if (!file.name.endsWith('.json')) {
			alert('Файл должен быть в формате JSON (.json).');
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const jsonString = e.target?.result as string;
				const data = JSON.parse(jsonString);

				// Validate JSON structure
				if (
					!data.nodes ||
					!Array.isArray(data.nodes) ||
					!data.edges ||
					!Array.isArray(data.edges)
				) {
					throw new Error(
						'Неверный формат JSON: ожидается объект с полями "nodes" и "edges" (массивы).'
					);
				}

				// Update Svelte stores
				nodes.set(data.nodes);
				edges.set(data.edges);

				alert('Система успешно импортирована!');
			} catch (error) {
				alert(`Ошибка при импорте`);
			}

			// Reset input
			input.value = '';
		};
		reader.onerror = () => {
			alert('Ошибка при чтении файла.');
			input.value = '';
		};
		reader.readAsText(file);
	};
</script>

<!-- Navigation Bar -->
<Navbar class="border-b border-gray-200 px-6 py-2.5 dark:border-gray-700">
	<NavBrand href="/">
		<span class="text-2xl font-bold text-blue-600 dark:text-blue-500">SIB</span>
	</NavBrand>
	<NavHamburger />
	<NavUl>
		<NavLi class="flex items-center">
			<button class="flex items-center" onclick={(e) => onExport()} aria-label="Export">
				<FileExportOutline class="mr-1 h-5 w-5" />Export
			</button>
		</NavLi>
		<NavLi class="flex items-center">
			<input
				type="file"
				id="import"
				accept=".json"
				class="hidden"
				onchange={onImport}
				aria-label="Import"
			/>
			<button
				class="flex items-center"
				onclick={() => document.getElementById('import')?.click()}
				aria-label="Import"
			>
				<FileImportOutline class="mr-1 h-5 w-5" />Import
			</button>
		</NavLi>
		<NavLi>
			<button onclick={toggleDarkMode} class="flex items-center" aria-label="Toggle dark mode">
				{#if settings.darkMode}
					<SunOutline class="h-5 w-5" />
				{:else}
					<MoonOutline class="h-5 w-5" />
				{/if}
			</button>
		</NavLi>
	</NavUl>
</Navbar>
