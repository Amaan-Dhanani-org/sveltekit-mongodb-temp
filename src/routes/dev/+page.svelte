<script lang="ts">
	import { Flex, Header, Text, Button } from "sk-clib";
	import { onMount } from "svelte";
	import { getCookie } from "$lib/utils";
	import { theme } from "sk-clib/theme";

	type ColorPair = {
		name: string;
		value: string;
	};

	let colors = $state<ColorPair[]>([]);

	onMount(() => {
		// Get md theme from cookies
		const md_theme_json: string | undefined = getCookie("md-theme");
		if (!md_theme_json) throw new Error("Failed to read md_theme from cookies");

		// Convert the json into a object we can use
		let md_theme: Record<string, string> = JSON.parse(md_theme_json);

		// Iterate through each color
		Object.keys(md_theme).forEach((color) => {
			// Only allow actual color tags
			if (!color.startsWith("--color")) return;

			const color_formatted = color.split("--color-")[1];

			const value: string = md_theme[color];

			// Prevent on colors
			if (color_formatted.startsWith("on-")) return;

			// Add colors to state
			colors.push({
				name: color_formatted,
				value: value,
			});
		});
	});

	$effect(() => {
		$inspect(colors)
	})

	function color_update(event: Event) {
		theme.seedColor = (event.target as HTMLInputElement).value;
	}

	function reset_colors(event: Event) {
		theme.mode = "dark";
		theme.variant = "vibrant";
		theme.seedColor = "#3d5cff";
	}
</script>

<Flex class="gap-10 p-5 h-fit" fillw col background>
	<Flex col class="gap-5">
		<input type="color" oninput={color_update} value={theme.seedColor} />

		<select bind:value={theme.mode} class="bg-surface-variant w-fit rounded-md p-4">
			<option value="light">Light</option>
			<option value="dark">Dark</option>
		</select>

		<select bind:value={theme.variant} class="bg-surface-variant w-fit rounded-md p-4">
			<option value="content">Content</option>
			<option value="expressive">Expressive</option>
			<option value="fidelity">Fidelity</option>
			<option value="fruit-salad">Fruit salad</option>
			<option value="monochrome">Monochrome</option>
			<option value="neutral">Neutral</option>
			<option value="rainbow">Rainbow</option>
			<option value="tonal-spot">Tonal spot</option>
			<option value="vibrant">Vibrant</option>
		</select>

		<Button class="w-fit cursor-pointer bg-inverse-on-surface" onclick={reset_colors}>Reset Config</Button>
	</Flex>

	<Flex class="flex-wrap gap-2">
		{#each colors as color}
			<Flex col class={`w-fit shrink-0 rounded-lg pb-5 pl-10 pr-5 pt-10 bg-${color.name} items-end justify-end`}>
				<Text lg class={`whitespace-nowrap text-on-${color.name}`}>{color.name}</Text>
			</Flex>
		{/each}
	</Flex>
</Flex>