import { json, type RequestHandler } from '@sveltejs/kit';
import { Session_Model, User_Model } from '$lib/server/models';

export const POST: RequestHandler = async ({ request }) => {
	let { token, name } = await request.json();
	name = name?.trim();

	const session = await Session_Model.findOne({ token })
		.populate({ path: 'userId', select: 'name' })
		.lean();

	const user = session?.userId as any;

	if (!name) {
		return json({ error: 'Please set a name.' }, { status: 400 });
	}

	if (user.name === name) {
		return json({
			error: 'Your new name must be different from the current name.' }, { status: 400 });
	}

	await User_Model.updateOne({ _id: user._id }, { name });

	return json({ success: 'Name updated.', name });
};