import { json, type RequestHandler } from '@sveltejs/kit';
import { Session_Model } from '$lib/server/models';

const greetings = ['Hey there!', 'Welcome!', 'Howdy!'];

export const POST: RequestHandler = async ({ request }) => {
	const { token } = await request.json();

	const session = await Session_Model
		.findOne({ token })
		.populate({
			path: 'userId',
			select: 'name'
		})
		.lean();

	const firstName =
		(session?.userId as any)?.name?.split(' ')[0];

	const greeting =
		firstName && firstName.length < 15
			? `Hi, ${firstName}!`
			: greetings[Math.floor(Math.random() * greetings.length)];

	return json({ greeting });
};