import { json, type RequestHandler } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
  // Parse the JSON body sent from the frontend
  const { id: token } = await request.json();

  if (!token) {
    return json({ valid: false });
  }

  try {
    // Verify the token manually sent in the POST body
    const auth = jwt.verify(token, SECRET_JWT_KEY) as { id: string };
    
    if (auth?.id) {
      // Return the ID directly as requested
      return json({ valid: true, id: auth.id });
    }
    
    return json({ valid: false });
  } catch (err) {
    return json({ valid: false });
  }
};
