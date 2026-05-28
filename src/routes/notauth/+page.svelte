<script lang="ts">
	import { Error, LightDark } from '$lib/components';
	import { Flex, Frame, Header, Text } from 'sk-clib';
	import Logo from '$lib/images/Logo.png';
    import { goto } from '$app/navigation';
</script>

<Flex col fill class="mt-8">
	<Flex class="sticky mr-4 h-16 justify-end">
		<LightDark />
	</Flex>
	<Header bold class="text-on-surface ml-4 !text-3xl sm:ml-0">Not Authorized</Header>
	<Text lg class="text-on-surface ml-4 opacity-80 sm:ml-0">Don't worry! It's nothing to freak out about!</Text>
	<Flex col fill surfaceVariant class="mt-2 box-border rounded-t-2xl p-6">
		<Flex fill>

            <Error big error="You are not authorized to access certain pages because you are not currently signed in. Please sign in to your account and try again." btnText="Sign In Instead" onclick={() => goto('/login')}/>

			<Frame class="mt-[8%] hidden lg:ml-4 lg:block lg:w-full">
				<img src={Logo} alt="Logo" />
			</Frame>
		</Flex>

		<img src={Logo} alt="Logo" class="block w-full object-contain lg:hidden" />
	</Flex>
</Flex>
