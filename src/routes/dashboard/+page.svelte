<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Flex, Frame, Button, Header, Text } from 'sk-clib';
	import { Error, Navigation } from '$lib/components';
	import Logo from '$lib/images/Logo.png';
	import { getCookie } from '$lib/utils';

	let error = $state('');
	let greeting = $state('');

	onMount(async () => {
		const token = await getCookie('auth-token');

		const response = await fetch('/api/dashboard', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ token })
		});

		const data = await response.json();
		greeting = data.greeting;
	});
</script>

<Flex col fill class="mt-20">
	<Header bold class="text-on-surface ml-4 !text-3xl sm:ml-0">
		{greeting}
	</Header>

	<Text lg class="text-on-surface ml-4 opacity-80 sm:ml-0">Here is your dashboard!</Text>

	<Flex col fill surfaceVariant class="mt-2 box-border gap-4 rounded-t-2xl p-6">
		<Text class="text-on-surface">
			I am a mostly empty dashboard. This is placeholder text.<br /><br />
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
			quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
			cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
		</Text>

		<Button onclick={() => goto('/logout')} class="mx-auto mb-4 block h-12 w-1/3 lg:w-1/4 cursor-pointer rounded-xl bg-red-500 text-white">Logout</Button>

		<img src={Logo} alt="Logo" class="mx-auto block object-contain w-1/2 lg:w-1/3"  />

		<Frame class="sticky bottom-0 h-8 pb-32">
			<Error duration={3000} {error} />
		</Frame>

		<Navigation page="dashboard"/>
	</Flex>
</Flex>
