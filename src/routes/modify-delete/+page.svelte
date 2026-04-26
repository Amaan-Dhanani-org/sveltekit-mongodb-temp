<script lang="ts">
	import { LightDark, Input, TextRedactor, CodeInput, Dropdown, Error, Success } from '$lib/components';
	import { Flex, Frame, Button, Header, Text } from 'sk-clib';
	import Logo from '$lib/images/Logo.png';
	import { goto } from '$app/navigation';
	import Back from '~icons/mdi/arrow-back';

	let form_el: HTMLFormElement;


	// Errors for forms
	let emailError = $state('');
	let passwordError = $state('');
	let newEmailError = $state('');
	let typeError = $state('');
	let codeError = $state('');
	let go_back_btn = $state(false);

	// svelte-ignore non_reactive_update
	let firstForm: HTMLFormElement; // to bind 1st form
	// svelte-ignore non_reactive_update
	let secondForm: HTMLFormElement; // to bind 2nd form
	let formStep = $state(1); // to help manage which form user is on
	let returnedEmail = $state(''); // email field to transfer data b/t users
	let whichEmail = $state(''); // indicates which email the verfication code's being sent to
	let whichAction = $state(''); // specifies what action user's taking by displayed description
	let typeValue = $state('Select an Option'); // to help bind data from dropdown properly
	let newPasswordLabel = $state(''); // dropdown options

	const types = ['Change Email', 'Change Password', 'Delete Account'];

	// function to change var when selecting value from dropdown
	function selectType(type: string) {
		typeValue = type;
		newPasswordLabel = type === 'Change Password' ? 'New ' : '';
	}

	// first form submit function
	async function firstForm_submit(event: Event) {
		event.preventDefault();

		if (typeValue === 'Select an Option') return;

		const response = await fetch(`/api/modify-delete/create`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(Object.fromEntries(new FormData(firstForm)))
		});

		const { emailError: eErr, passwordError: pErr, newEmailError: nErr, typeError: tErr, email, newEmail } = await response.json();

		if (response.status === 200) {
			formStep = 2;
			returnedEmail = email;
			whichEmail = typeValue === "Change Email" ? newEmail : email;
			whichAction = ({ "Change Email": "changing your email address", "Change Password": "changing your password", "Delete Account": "deleting your account" }[typeValue] ?? "");
		}

		if (response.status === 400) {
			emailError = passwordError = newEmailError = typeError = "";
			emailError = eErr;
			passwordError = pErr;
			newEmailError = nErr;
			typeError = tErr;
		}
	}

	async function secondForm_submit(event: Event) {
		event.preventDefault(); // no refresh

		const response = await fetch('/api/modify-delete/verify', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(Object.fromEntries(new FormData(secondForm)) as any)
		});

		const { codeError: cErr, go_back_btn: btn } = await response.json();

		if (response.status == 200) {
			formStep = 3;
		} else if (response.status == 400) {
			codeError = ''; // reset state so previous errors can appear again
			codeError = cErr;
			go_back_btn = btn;
		}
	}
</script>

<Flex col fill class="mt-8">
	<Flex class="sticky mr-4 justify-end">
		<LightDark />
	</Flex>

	<Header bold class="text-on-surface ml-4 !text-3xl sm:ml-0">Modify or Delete Account</Header>

	<Text lg class="text-on-surface ml-4 opacity-80 sm:ml-0">Reset your email/password or delete your account all right here!</Text>

	<Flex col fill surfaceVariant class="mt-2 box-border rounded-t-2xl p-6">
		<Flex fill>
		{#if formStep == 1}
			<form class="box-border flex size-full flex-col" bind:this={firstForm} onsubmit={firstForm_submit}>
				<Text class="text-secondary !text-[14px]">Action</Text>
				<Dropdown.Menu class="mb-4">
					<Dropdown.Trigger>
						<!--Need to have empty form attrbiute so the "button" isn't a "submit button"-->
						<Button class="bg-secondary text-on-secondary w-full rounded-xl px-4 py-2 text-left text-sm" form="">
							{typeValue}
						</Button>
					</Dropdown.Trigger>

					<Dropdown.Content>
						{#each types as type, i}
							<Dropdown.Button onclick={() => selectType(type)}>
								{type}
							</Dropdown.Button>

							{#if i < types.length - 1}
								<Dropdown.Divider />
							{/if}
						{/each}
					</Dropdown.Content>
				</Dropdown.Menu>

				<Input type="text" class="mb-4" name="email" label="Email" />
				<Input type="password" class="mb-4" name="password" label={newPasswordLabel + `Password`} />
				<Input class="hidden" name="type" value={typeValue} />
				{#if typeValue === "Change Email"}
					<Input type="text" class="mb-4" name="newEmail" label="New Email" />
				{/if}
				<Button class="bg-seed mb-4 mt-3 h-12 w-full rounded-xl text-white">Continue</Button>
				<Flex center class="gap-2">
					<a href="/" class="text-primary font-bold underline">Back to home</a>
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
						We just emailed a verification code to <TextRedactor class="text-primary" text={whichEmail} />. Please check your inbox. If you don’t
						see it, check your spam folder. The code expires in 10 minutes. If it expires, you will need to refresh the page and start the
						process again. By completing this step, you are {whichAction}.
					</Text>
					<CodeInput classWrapper="pb-[3px]" name="code" />
					<Input class="hidden" name="email" value={returnedEmail} />
					<Button class="bg-seed mx-auto mb-4 h-10 cursor-pointer text-white">Verify</Button>
				</form>
			{/if}

			{#if go_back_btn}
				<Error big error={codeError} btnText="Back to Home" onclick={()=>goto('/')} />
			{/if}

			{#if formStep == 3}
				<Success big success={`You are successfully done ${whichAction}.`} btnText="Back to Home" onclick={()=>goto('/')} />
			{/if}

			<Frame class="mt-[8%] hidden lg:ml-4 lg:block lg:w-full">
				<img src={Logo} alt="Logo" />
			</Frame>
		</Flex>

		<Error duration={3000} error={emailError} />
		<Error duration={3000} error={passwordError} />
		<Error duration={3000} error={newEmailError} />
		<Error duration={3000} error={typeError} />
		{#if !go_back_btn}
			<Error error={codeError} />
		{/if}

		<img src={Logo} alt="Logo" class="block w-full object-contain lg:hidden" />
	</Flex>
</Flex>