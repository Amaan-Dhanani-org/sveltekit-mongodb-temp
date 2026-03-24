<script lang="ts">
	import { theme } from 'sk-clib/theme';
	import { Frame, Flex, Text } from 'sk-clib';
	import { cn } from '$lib/utils';
	import IconDark from '~icons/material-symbols/dark-mode-outline';
	import IconLight from '~icons/material-symbols/light-mode-outline';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { type Props } from '..';

	let { text = false, btnColor = 'secondary', iconColor = 'on-secondary', textColor = 'on-surface', divClass = 'relative'}: Props = $props();

	let mounted = $state(false);
	const isDark = $derived(theme.mode === 'dark');

	onMount(() => {
		mounted = true;
	});
</script>

{#if mounted}
	<div class={divClass} transition:fade={{ duration: 500 }}>
		<Frame fillw class="gap-10">
			<Flex center class="gap-2">
				<button
					onclick={() => (theme.mode = isDark ? 'light' : 'dark')}
					class={cn('flex cursor-pointer rounded-full p-3', `bg-${btnColor}`, `text-${iconColor}`)}
				>
					{#if isDark}
						<IconDark class="size-6" />
					{:else}
						<IconLight class="size-6" />
					{/if}
				</button>

				{#if text}
					<Text class={cn('text-sm select-none', `text-${textColor}`)}>
						{isDark ? 'Dark' : 'Light'}
					</Text>
				{/if}
			</Flex>
		</Frame>
	</div>
{/if}
