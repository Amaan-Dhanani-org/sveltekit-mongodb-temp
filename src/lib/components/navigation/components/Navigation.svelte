<script lang="ts">
	import { Flex, Button, Text } from "sk-clib";
	import { type Component } from "svelte";
	import IconSettings from '~icons/ic/baseline-settings';
	import IconDashboard from '~icons/material-symbols/dashboard';
	import IconAcocuntCog from '~icons/mdi/account-cog';
	import IconLogout from '~icons/material-symbols/logout';
	import { type Props } from '..';
	import { cn } from "$lib/utils";
	let { page = "dashboard" }: Props = $props();
</script>

{#snippet widgetButton(text: string, Icon: Component, href?: string)}
	<Flex col class="mb-2 gap-1 items-center">
		<Button href={href} class="cursor-pointer rounded-full bg-(--color-seed)/80 p-3 hover:bg-(--color-seed)/100">
			<Icon class="text-white size-6" />
		</Button>
		<Text class="select-none text-sm">{text}</Text>
	</Flex>
{/snippet}

<Flex fillw outline class="fixed right-0 bottom-0 left-0 z-10 h-24 rounded-t-4xl items-end justify-around">
{#if page=="dashboard"}
	{@render widgetButton('Settings', IconSettings, '/settings')}
{:else if page=="settings"}
	{@render widgetButton('Dashboard', IconDashboard, '/dashboard')}
	{@render widgetButton('Modify/Delete Account', IconAcocuntCog, '/modify-delete')}
	{@render widgetButton('Logout', IconLogout, '/logout')}
{/if}

</Flex>