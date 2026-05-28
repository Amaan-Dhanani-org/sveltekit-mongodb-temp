import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { Session_Model } from '$lib/server/models';

export const POST: RequestHandler = async ({ request }) => {
	const { token } = await request.json();

	await Session_Model.deleteOne({ token });

	return json(null, { status: 200 });
};