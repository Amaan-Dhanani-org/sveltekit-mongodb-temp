<script lang="ts">
	import RoundSuccess from '~icons/ic/baseline-check-circle';
	import type { Props } from '..';
	import { cn } from '$lib/utils';
	import { Frame, Flex } from 'sk-clib';
	import { fade } from 'svelte/transition'; // Added for smooth "fade"

	let { 
		success = $bindable(), 
		big, 
		onclick, 
		btnText, 
		duration,
		divClass = $bindable('w-full'), 
		class: className 
	}: Props = $props();

	let divCls = $state(cn(divClass, className));
	
	$effect(() => {
		divCls = cn(divClass, className);
	});

	// Only runs if success is present AND duration is provided
	$effect(() => {
		if (success && duration && duration > 0) {
			const timer = setTimeout(() => {
				success = ""; 
			}, duration);

			return () => clearTimeout(timer);
		}
	});
</script>

{#if success}
	<!-- transition:fade makes it disappear smoothly -->
	<div transition:fade={{ duration: 500 }}>
		{#if big}
			<Frame class={divCls}>
				<Frame class="w-full mx-auto max-w-[290px] overflow-hidden rounded-lg bg-white shadow-lg">
					<Frame class="p-5 text-center">
						<Frame class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
							<RoundSuccess class="h-6 w-6 text-teal-600" />
						</Frame>
						<h3 class="mt-3 text-base font-semibold text-gray-900">Yay, you did it!</h3>
						<p class="mt-2 text-sm text-gray-500">{success}</p>
						{#if btnText}
							<button class="mt-4 w-full cursor-pointer rounded-md bg-teal-600 px-4 py-2 text-base font-medium text-white" onclick={onclick}>
								{btnText}
							</button>
						{/if}
					</Frame>
				</Frame>
			</Frame>
		{:else}
			<Flex center class="relative gap-2 rounded-lg border border-teal-400 bg-teal-100 px-2 py-1 text-[12px] text-teal-700">
				<RoundSuccess class="inline h-[16px] w-[16px]" />
				{success}
			</Flex>
		{/if}
	</div>
{/if}
