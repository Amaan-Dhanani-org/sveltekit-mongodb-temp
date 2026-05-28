<script lang="ts">
	import { Success, LightDark } from '$lib/components';
	import { Flex, Frame, Header, Text } from 'sk-clib';
	import Logo from '$lib/images/Logo.png';
	import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { getCookie, deleteCookie } from '$lib/utils';


    onMount(async () => {
		const token = await getCookie('auth-token');

		await fetch('/api/logout', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ token })
		});

		await deleteCookie('auth-token');
	});
</script>

<Flex col fill class="mt-8">
	<Flex class="sticky mr-4 h-16 justify-end">
		<LightDark />
	</Flex>

	<Header bold class="text-on-surface ml-4 !text-3xl sm:ml-0">
		Logout
	</Header>

	<Text lg class="text-on-surface ml-4 opacity-80 sm:ml-0">
		You've safely escaped the app. For now.
	</Text>

	<Flex col fill surfaceVariant class="mt-2 box-border rounded-t-2xl p-6">
		<Flex fill>
			<Success
				big
				success="You have successfully logged out of your account. Come back anytime; we'll keep your seat warm."
				btnText="Back to Home"
				onclick={() => goto('/')}
			/>

			<Frame class="mt-[8%] hidden lg:ml-4 lg:block lg:w-full">
				<img src={Logo} alt="Logo" />
			</Frame>
		</Flex>

		<img
			src={Logo}
			alt="Logo"
			class="block w-full object-contain lg:hidden"
		/>
	</Flex>
</Flex>