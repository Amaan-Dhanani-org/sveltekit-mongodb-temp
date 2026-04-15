/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CapacitorCookies } from '@capacitor/core';
import { browser } from '$app/environment';

/**
 * Merge Tailwind CSS class names safely.
 *
 * Combines the power of `clsx` and `tailwind-merge`:
 * - `clsx` allows conditional and dynamic class composition
 * - `twMerge` removes conflicting Tailwind classes (e.g., `p-2` vs `p-4`)
 *
 * @param {...(ClassValue | unknown)[]} inputs - Any number of class values, including strings, arrays, or conditional objects
 * @returns {string} A single merged class string with conflicts resolved
 *
 * @example
 * cn("p-2", condition && "bg-red-500", "p-4")
 * // → "bg-red-500 p-4"
 *
 * Created by GitHub User TreltaSev
 */
export function cn(...inputs: (ClassValue | unknown)[]) {
	return twMerge(clsx(inputs));
}

/**
 * Set a browser cookie using Capacitor.
 *
 * This function only runs in the browser environment.
 *
 * @param {string} key - The name of the cookie
 * @param {string} value - The value to store in the cookie
 * @returns {Promise<void>} Resolves when the cookie is successfully set
 *
 * @example
 * await setCookie("token", "abc123");
 */
export async function setCookie(key: string, value: string) {
	if (browser) {
		await CapacitorCookies.setCookie({ key, value });
	}
}

/**
 * Retrieve a cookie value by its key.
 *
 * This function only runs in the browser environment.
 *
 * @param {string} key - The name of the cookie to retrieve
 * @returns {Promise<string | undefined>} The cookie value if found, otherwise `undefined`
 *
 * @example
 * const token = await getCookie("token");
 */
export async function getCookie(key: string) {
	if (browser) {
		const result = await CapacitorCookies.getCookies();
		return result[key];
	}
}

/**
 * Delete a cookie by its key.
 *
 * This function removes the specified cookie from the browser.
 * Works in both browser and Capacitor environments.
 *
 * @param {string} key - The name of the cookie to delete
 * @returns {Promise<void>} Resolves when the cookie is deleted
 *
 * @example
 * await deleteCookie("token");
 */
export async function deleteCookie(key: string) {
	await CapacitorCookies.deleteCookie({ key });
}