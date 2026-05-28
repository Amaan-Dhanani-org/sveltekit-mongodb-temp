import { json, type RequestHandler } from '@sveltejs/kit';
import { Session_Model } from '$lib/server/models';

export const POST: RequestHandler = async ({ request }) => {
	const { token } = await request.json();

	const session = await Session_Model
		.findOne({ token })
		.populate({ path: 'userId', select: 'name' })
		.lean();

	const user = session?.userId as any;

	return json({
		name: user?.name ?? null
	});
};