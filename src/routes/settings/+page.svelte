<script lang="ts">
	import { Frame, Flex, Button, Header, Text } from 'sk-clib';
	import { goto } from '$app/navigation';
	import { Error, Input, Success, LightDark, Navigation } from '$lib/components';
	import Logo from '$lib/images/Logo.png';
	import { getCookie } from '$lib/utils';
	import { onMount } from 'svelte';

	let success = $state(''); // only one success
	let token = $state(); // value to store token in

	// svelte-ignore non_reactive_update
	let nameForm: HTMLFormElement; // to bind 1st form
	//== ADD MORE FORMS ==//

	let nameError = $state('');
	//== ADD MORE ERRORS ==//

	let displayedName = $state(''); //state that constantly shows name
	//== ADD MORE VARIABLES ==//

	onMount(async () => {
		token = await getCookie('auth-token');

		const response = await fetch('/api/settings/load', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ token })
		});

		const data = await response.json();
		displayedName = data.name;
	});

	// first form submit function
	async function nameForm_submit(event: Event) {
		event.preventDefault(); // no refresh

		const response = await fetch('/api/settings/name', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				...Object.fromEntries(new FormData(nameForm)),
				token
			})
		});

		const data = await response.json();

		if (response.ok) {
			success = ''; // reset state so previous errors can appear again
			success = data.success;
		} else {
			nameError = ''; // reset state so previous errors can appear again
			nameError = data.error;
		}
	}
	//== ADD MORE SUBMIT FUNCTIONS ==//
</script>

<Flex col fill class="mt-20">
	<Header bold class="text-on-surface ml-4 !text-3xl sm:ml-0">Settings</Header>
	<Text lg class="text-on-surface ml-4 opacity-80 sm:ml-0">Adjust your simple settings here such as your name and theme!</Text>
	<Flex col fill surfaceVariant class="mt-2 box-border gap-4 rounded-t-2xl p-6">
		<form class="flex lg:w-[50%] mx-auto flex-row items-end gap-4" bind:this={nameForm} onsubmit={nameForm_submit}>
			<Flex col fill>
				<Input type="text" name="name" label="Change Name" bind:value={displayedName} />
			</Flex>
			<Button class="bg-seed h-10 rounded-md px-4 text-sm whitespace-nowrap text-white cursor-pointer">Update</Button>
		</form>

		<LightDark text />

		<img src={Logo} alt="Logo" class="mx-auto block object-contain w-1/2 lg:w-1/3"  />
		<Frame class="sticky bottom-0 h-8 pb-32">
			<Success duration={3000} {success} />
			<Error duration={3000} error={nameError} />
			<!--ADD MORE ERRORS --> 
		</Frame>
		<Navigation page="settings"/>
	</Flex>
</Flex>
