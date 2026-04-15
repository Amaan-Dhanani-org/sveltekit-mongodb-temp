<script lang="ts">
	import RoundError from '~icons/ic/round-error';
	import type { Props } from '..';
	import { cn } from '$lib/utils';
	import { Frame, Flex } from 'sk-clib';
	import { fade } from 'svelte/transition'; // Added for smooth "fade"

	let { error = $bindable(), big, onclick, btnText, duration, divClass = $bindable('w-full'), class: className }: Props = $props();

	// svelte-ignore state_referenced_locally
		let divCls = $state(cn(divClass, className));

	$effect(() => {
		divCls = cn(divClass, className);
	});

	// Only runs if error is present AND duration is provided
	$effect(() => {
		if (error && duration && duration > 0) {
			const timer = setTimeout(() => {
				error = '';
			}, duration);

			return () => clearTimeout(timer);
		}
	});
</script>

{#if error}
	<!-- transition:fade makes it disappear smoothly -->
	<div transition:fade={{ duration: 500 }} class={divCls}>
		{#if big}
				<Frame class="mx-auto w-full max-w-[290px] overflow-hidden rounded-lg bg-white shadow-lg">
					<Frame class="p-5 text-center">
						<Frame class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
							<RoundError class="h-6 w-6 text-red-600" />
						</Frame>
						<h3 class="mt-3 text-base font-semibold text-gray-900">Oops, this sucks!</h3>
						<p class="mt-2 text-sm text-gray-500">{error}</p>
						{#if btnText}
							<button class="mt-4 w-full cursor-pointer rounded-md bg-red-600 px-4 py-2 text-base font-medium text-white" {onclick}>
								{btnText}
							</button>
						{/if}
					</Frame>
				</Frame>
		{:else}
			<Flex center class="relative gap-2 rounded-lg border border-red-400 bg-red-100 px-2 py-1 text-[12px] text-red-700">
				<RoundError class="inline h-[16px] w-[16px]" />
				{error}
			</Flex>
		{/if}
	</div>
{/if}
