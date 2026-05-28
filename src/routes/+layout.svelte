<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { getCookie } from '$lib/utils';
	import { fade } from 'svelte/transition';

	const protected_routes = ['/dashboard', '/settings'];

	let mounted = $state(false);

	$effect(() => {
		(async () => {
			mounted = false;
			const pathname = page.url.pathname;
			const token = await getCookie('auth-token');

			const res = await fetch('/api/auth', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token })
			});

			const { auth } = await res.json();

			if (auth && pathname === '/login') {
				goto('/dashboard');
			}

			if (!auth && protected_routes.includes(pathname)) {
				goto('/notauth');
				return;
			}

			mounted = true;
		})();
	});

	import '../app.css';
	import { Flex } from 'sk-clib';
	import { ThemeInit } from 'sk-clib/theme';

	let { children } = $props();
</script>

<ThemeInit defaults={{ defaultSeedColor: '#3d5cff', defaultMode: 'dark', defaultVariant: 'vibrant' }} />

<Flex fill surface class="overflow-y-auto">
	{#if mounted}
		<div class="mx-auto flex w-full max-w-full flex-col sm:max-w-3/4 md:max-w-3/5 lg:max-w-3/4" in:fade={{ duration: 100 }}>
			{@render children()}
		</div>
	{/if}
</Flex>
