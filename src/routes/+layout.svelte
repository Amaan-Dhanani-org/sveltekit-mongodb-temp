<script lang="ts">
	import '../app.css';
	import { Flex } from 'sk-clib';
	import { ThemeInit } from 'sk-clib/theme';
	let { children } = $props();
	import { getCookie } from '$lib/utils';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(async () => {
		const id = getCookie('auth-token');

		const result = await fetch('/api/auth', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ token: id }),
		});

		const data = await result.json();

		if (!data.valid) {
			goto("/logout");
		}

	});
</script>

<ThemeInit defaults={{ defaultSeedColor: '#3d5cff', defaultMode: 'dark', defaultVariant: 'vibrant' }} />

<Flex fill surface class="overflow-y-auto">
	<Flex col fillw class="animate mx-auto max-w-full sm:max-w-3/4 md:max-w-3/5 lg:max-w-3/4">
		{@render children()}
	</Flex>
</Flex>
