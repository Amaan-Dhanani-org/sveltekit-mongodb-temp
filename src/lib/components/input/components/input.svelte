<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Props } from '..';
	import Eye from '~icons/heroicons/eye';
	import EyeSlash from '~icons/heroicons/eye-slash';

	let {
		type = '',
		children,
		class: className,
		inputClass = $bindable(
			'bg-secondary truncate text-on-secondary box-border rounded-3 px-3 py-4 w-full text-[14px] rounded-[12px] px-4 py-3'
		),
		labelClass = $bindable('text-secondary text-[14px]'),
		classLabel = $bindable(''),
		label = $bindable(undefined),
		value = $bindable(undefined),
		...rest
	}: Props = $props();

	const inputId = rest.id ?? 'hs-input-' + crypto.randomUUID();

	// --- reactive classes
	let inputCls = $state(cn(inputClass, className));
	let labelCls = $state(cn(labelClass, classLabel));
	$effect(() => {
		inputCls = cn(inputClass, className);
		labelCls = cn(labelClass, classLabel);
	});

	// --- password toggling
	let showPassword = $state(false);
	function togglePassword() {
		showPassword = !showPassword;
	}
</script>

{#if label !== undefined && type !== "hidden"}
	<label class={labelCls} for={inputId}>{label}</label>
{/if}

{#if type === 'password'}
	<div class={cn(inputCls, 'relative p-0')}>
		<input id={inputId} class="w-full pl-4 pr-8 py-3 outline-none" bind:value type={showPassword ? 'text' : 'password'} {...rest} />

		<button
			type="button"
			onclick={togglePassword}
			class="absolute inset-y-0 end-0 z-20 cursor-pointer items-center rounded-e-md px-3 text-on-secondary focus:text-primary focus:outline-none dark:text-white dark:focus:text-blue-500"
			aria-label="Toggle password visibility"
		>
			<!-- eye / eye‑off icon -->
			{#if showPassword}
				<!-- eye‑off -->
				<EyeSlash/>
			{:else}
				<!-- eye -->
				<Eye/>
			{/if}
		</button>
	</div>
{:else}
	<!-- Plain input -->
	<input class={inputCls} type={type} id={inputId} bind:value {...rest} />
{/if}