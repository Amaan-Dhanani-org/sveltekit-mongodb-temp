import { json, type RequestHandler } from '@sveltejs/kit';
import { Session_Model } from '$lib/server/models';

export const POST: RequestHandler = async ({ request }) => {
  try {
    
    const { token } = await request.json();

    const session = await Session_Model.findOne({ token });

    if (session) {
      return json({ auth: true }, { status: 200 });
    } else {
      return json({ auth: false }, { status: 400 });
    }
  } catch (error) {
    console.error('Database connection error:', error);
    return json({ error: 'Database connection error!' }, { status: 500 });
  }
};