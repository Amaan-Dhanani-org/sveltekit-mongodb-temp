// import type { PageServerLoad, Actions } from "./$types";
// import { updateName, returnName } from "$lib/server/settings";

// export const load: PageServerLoad = async ({ cookies }) => {
// 	const name = returnName(cookies);
// 	if (!name) return { error: "You are an invalid user or are not authenicated. Try logging in again, maybe?"};
// 	return { name: await returnName(cookies) };
// };

// export const actions: Actions = {
// 	name: async ({ cookies, request }) => {
// 		const data = await request.formData();
// 		const name = data.get("name")?.toString().trim();
// 		const error = await updateName(name, cookies);
// 		if (error) return { error };
// 		return { success: "You have successfully changed your name!" };
// 	}
// };

