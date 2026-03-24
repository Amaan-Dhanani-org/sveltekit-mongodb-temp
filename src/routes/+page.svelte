<script lang="ts">
	import { Flex, Button } from 'sk-clib';
	import Logo from '$lib/images/Logo.png';
	import { LightDark } from '$lib/components';
</script>

<Flex col fill class="mt-20">
	<img src={Logo} alt="Logo" class="mx-[15%] mb-7 block object-contain" />
	<Flex col fill surfaceVariant class="mt-2 box-border gap-8 rounded-t-2xl p-6">
		<Button href="/register" class="bg-seed h-16 w-full cursor-pointer rounded-2xl text-lg text-white">Register</Button>
		<Button href="/login" class="bg-seed h-16 w-full cursor-pointer rounded-2xl text-lg text-white">Login</Button>
		<Button href="/modify-delete" class="bg-seed h-16 w-full cursor-pointer rounded-xl text-white">Modify or Delete Account</Button>
		<Flex class="justify-end">
			<LightDark />
		</Flex>
	</Flex>
</Flex>
