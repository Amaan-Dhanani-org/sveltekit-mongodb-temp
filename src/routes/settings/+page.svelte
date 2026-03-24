<script lang="ts">
	import { Frame, Flex, Button, Header, Text } from 'sk-clib';
	import { Error, Input, Success, LightDark, Navigation } from '$lib/components';
	import Logo from '$lib/images/Logo.png';
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	let { data, form }: { data: PageData; form: ActionData } = $props();

	const preventReset = () => {
		return async ({ update }: { update: any }) => {
			await update({ reset: false });
		};
	};
</script>

<Flex col fill class="mt-20">
	<Header bold class="text-on-surface ml-4 !text-3xl sm:ml-0">Settings</Header>
	<Text lg class="text-on-surface ml-4 opacity-80 sm:ml-0">Adjust your simple settings here!</Text>
	<Flex col fill surfaceVariant class="mt-2 box-border gap-4 rounded-t-2xl p-6">
		<form action="?/name" method="POST" autocomplete="off" use:enhance={preventReset} class="flex w-full flex-row items-end gap-4">
			<Flex col fill>
				<Input type="text" id="name_input" name="name" label="Change Name" value={data.name} />
			</Flex>
			<Button class="bg-seed h-10 rounded-md px-4 text-sm whitespace-nowrap text-white">Update</Button>
		</form>

		<LightDark text />

		<Button href="/dashboard" class="bg-seed h-12 mt-10 w-full cursor-pointer rounded-xl text-white">Back to Dashboard</Button>
		<Button href="/modify-delete" class="h-12 w-full cursor-pointer rounded-xl bg-orange-500 text-white">Modify or Delete Account</Button>
		<Button href="/logout" class="h-12 w-full cursor-pointer rounded-xl bg-red-500 text-white">Logout</Button>
		<img src={Logo} alt="Logo" class="mx-[5%] mt-7 block object-contain" />
		<Frame class="sticky bottom-0 h-8 pb-32">
			<Success duration={3000} success={form?.success} />
			<Error duration={3000} error={form?.error} />
			<Error duration={3000} error={data.error} />
		</Frame>
		<Navigation />
	</Flex>
</Flex>
