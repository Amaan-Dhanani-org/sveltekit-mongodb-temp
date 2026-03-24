/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Fix class naming conflicts by utilizing both :function:`twMerge` and :function:`clsx`
 * clsx allows very precise boolean specific class loading and twMerge removes all the conflicting but unused classes.
 * @param inputs All base classes
 * @returns Merged classes  
 * 
 * Created by GitHub User TreltaSev
 */
export function cn(...inputs: (ClassValue | unknown)[]) {
    return twMerge(clsx(inputs));
}

/**
 * Gets a specific cookie from the document's cookies. Requires the page to already
 * have been rendered since `document` is accessed
 * @param name - Name of the cookie that will be extracted
 * 
 * Created by GitHub User TreltaSev  
 */
export function getCookie(name: string): string | undefined {
	const value: string = `; ${document.cookie}`;
	const parts: string[] = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop()?.split(';').shift();
}