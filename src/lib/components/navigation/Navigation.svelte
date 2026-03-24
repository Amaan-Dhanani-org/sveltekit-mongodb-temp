<script lang="ts">
	import { Flex, Frame, Button, Text } from "sk-clib";
	import { type Component } from "svelte";
	import IconSettings from '~icons/ic/baseline-settings';
</script>

{#snippet widgetButton(text: string, Icon: Component, href?: string)}
	<Flex col class="mb-2 gap-1 items-center">
		<Button href={href} class="cursor-pointer rounded-full bg-(--color-seed)/80 p-3 hover:bg-(--color-seed)/100">
			<Icon class="text-white size-6" />
		</Button>
		<Text class="select-none" lg>{text}</Text>
	</Flex>
{/snippet}

<Flex fillw outline class="fixed right-0 bottom-0 left-0 z-10 h-24 rounded-t-4xl items-end justify-around">
	{@render widgetButton('Option', IconSettings)}
	{@render widgetButton('Option', IconSettings)}
	{@render widgetButton('Option', IconSettings)}
	{@render widgetButton('Settings', IconSettings, '/settings')}
</Flex>