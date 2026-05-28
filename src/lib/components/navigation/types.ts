import type { HTMLAttributes } from 'svelte/elements';

export type tNavigationProps = HTMLAttributes<HTMLDivElement> & {
    page: string;
};
