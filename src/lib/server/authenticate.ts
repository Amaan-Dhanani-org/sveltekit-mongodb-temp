import jwt from "jsonwebtoken";
import { SECRET_JWT_KEY } from "$env/static/private";
import type { Cookies } from "@sveltejs/kit";

export function authenticate(cookies: Cookies): boolean | string | undefined {
  const token = cookies.get("auth-token");
  console.log(token, "You're cooked");
  if (!token) return undefined;

  try {
    const auth = jwt.verify(token, SECRET_JWT_KEY) as { id: string };
    // Return the string directly instead of an object
    return auth?.id ? auth.id : false;
  } catch {
    return false;
  }
}