import type { HTMLAttributes } from 'svelte/elements';

export type tLightDarkProps = HTMLAttributes<HTMLDivElement> & {
    text?: boolean;
    btnColor?: string;
    iconColor?: string;
    textColor?: string;
    divClass?: string;
};
