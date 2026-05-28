<script lang="ts">
	import { LightDark, Input, TextRedactor, CodeInput, Dropdown, Error, Success } from '$lib/components';
	import { Flex, Frame, Button, Header, Text } from 'sk-clib';
	import { goto } from '$app/navigation';
	import Logo from '$lib/images/Logo.png';
	import { setCookie } from '$lib/utils';
	import Back from '~icons/mdi/arrow-back';

	// svelte-ignore non_reactive_update
	let firstForm: HTMLFormElement; // to bind 1st form
	// svelte-ignore non_reactive_update
	let secondForm: HTMLFormElement; // to bind 2nd form
	let formStep = $state(1); // to help manage which form user is on
	let returnedEmail = $state(''); // email field to transfer data b/t users
	let accountTypeValue = $state('Select an Option'); // to help bind data from dropdown properly
	const accountTypes = ['Account Type 1', 'Account Type 2']; // dropdown options

	// Errors for forms
	let emailError = $state('');
	let passwordError = $state('');
	let typeError = $state('');
	let codeError = $state('');
	let go_back_btn = $state(false);

	// function to change var when selecting value from dropdown
	function selectType(type: string) {
		accountTypeValue = type;
	}

	// first form submit function
	async function firstForm_submit(event: Event) {
		event.preventDefault(); // no refresh

		const response = await fetch('/api/register/create', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(Object.fromEntries(new FormData(firstForm)) as any)
		});

		const data = await response.json();

		if (response.ok) {
			formStep = 2;
			returnedEmail = data.email;
			await setCookie('verify-email', data.email);
		} else {
			emailError = passwordError = typeError = ''; // reset state so previous errors can appear again
			emailError = data.emailError;
			passwordError = data.passwordError;
			typeError = data.typeError;
		}
	}

	async function secondForm_submit(event: Event) {
		event.preventDefault(); // no refresh

		const response = await fetch('/api/register/verify', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(Object.fromEntries(new FormData(secondForm)) as any)
		});

		const data = await response.json();

		if (response.ok) {
			formStep = 3;
		} else {
			codeError = ''; // reset state so previous errors can appear again
			codeError = data.codeError;
			go_back_btn = data.go_back_btn;
		}
	}
</script>

<Flex col fill class="mt-8">
	<Flex class="sticky mr-4 h-16 justify-end">
		<LightDark />
	</Flex>
	<Header bold class="text-on-surface ml-4 !text-3xl sm:ml-0">Sign Up</Header>
	<Text lg class="text-on-surface ml-4 opacity-80 sm:ml-0">Enter your details below to start your journey!</Text>
	<Flex col fill surfaceVariant class="mt-2 box-border rounded-t-2xl p-6">
		<Flex fill>
			{#if formStep == 1}
				<form class="box-border flex size-full flex-col" bind:this={firstForm} onsubmit={firstForm_submit}>
					<Text class="text-secondary !text-[14px]">Type</Text>
					<Dropdown.Menu class="mb-4">
						<Dropdown.Trigger>
							<!--Need to have empty form attrbiute so the "button" isn't a "submit button"-->
							<Button class="bg-secondary text-on-secondary block w-full cursor-pointer rounded-xl px-4 py-2 text-left text-sm" form="">
								{accountTypeValue}
							</Button>
						</Dropdown.Trigger>

						<Dropdown.Content>
							{#each accountTypes as type, i}
								<Dropdown.Button onclick={() => selectType(type)}>
									{type}
								</Dropdown.Button>

								{#if i < accountTypes.length - 1}
									<Dropdown.Divider />
								{/if}
							{/each}
						</Dropdown.Content>
					</Dropdown.Menu>
					<Input type="hidden" name="type" bind:value={accountTypeValue} />

					<Input type="text" class="mb-4" name="email" label="Email" />
					<Input type="password" class="mb-7" label="Password" name="password" />

					<Button class="bg-seed mb-4 h-12 w-full cursor-pointer rounded-xl text-white">Register</Button>

					<Flex center class="gap-2">
						<Text lg class="text-on-surface">Already have an account?</Text>
						<a href="/login" class="text-primary font-bold underline">Sign In</a>
					</Flex>
				</form>
			{/if}

			{#if formStep == 2 && !go_back_btn}
				<form class="text-on-surface box-border flex size-full flex-col gap-4" bind:this={secondForm} onsubmit={secondForm_submit}>
					<Flex centerx class="relative">
						<!--specify type so when users presses enter to submit form it doesn't redirect-->
						<Button type="button" href="/" class="flex cursor-pointer rounded-full bg-red-700 p-3">
							<Back class="size-6" />
						</Button>
						<Text bold class="absolute left-1/2 -translate-x-1/2 transform text-center">Verify Code</Text>
					</Flex>
					<Text class="text-center text-sm">
						We just emailed a verification code to <TextRedactor class="text-primary" text={returnedEmail} />. Please check your inbox. If you don’t
						see it, check your spam folder. The code expires in 10 minutes. If it expires, you will need to refresh the page and start the
						registration process again.
					</Text>
					<CodeInput classWrapper="pb-[3px]" name="code" />
					<Input class="hidden" name="email" value={returnedEmail} />
					<Button class="bg-seed mx-auto mb-4 h-10 cursor-pointer text-white">Verify</Button>
				</form>
			{/if}

			{#if go_back_btn}
				<Error big error={codeError} btnText="Back to Home" onclick={() => goto('/')} />
			{/if}

			{#if formStep == 3}
				<Success big success="You've been successfully registered." btnText="Continue to Login" onclick={() => goto('/login')} />
			{/if}
			<Frame class="mt-[8%] hidden lg:ml-4 lg:block lg:w-full">
				<img src={Logo} alt="Logo" />
			</Frame>
		</Flex>

		<!-- ERRORS -->
		<Error duration={3000} error={passwordError} />
		<Error duration={3000} error={emailError} />
		<Error duration={3000} error={typeError} />
		{#if !go_back_btn}
			<Error error={codeError} />
		{/if}
		<img src={Logo} alt="Logo" class="block w-full object-contain lg:hidden" />
	</Flex>
</Flex>
