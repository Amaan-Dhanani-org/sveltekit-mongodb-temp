import { superValidate } from "sveltekit-superforms/server";
import { zod4 } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { loginSchema } from "$lib/validation";
import { login_user } from "$lib/server/login";
import { setError } from "sveltekit-superforms/server";
import { User_Model } from '$lib/server/models';
import { authenticate } from "$lib/server/authenticate";

export const load: PageServerLoad = async ({ cookies }) => {
    const id = authenticate(cookies);
    const user = await User_Model.findById(id);
    if (user) throw redirect(307, "/dashboard");

    const form = await superValidate(zod4(loginSchema));
    return { form };
}

export const actions = {
    default: async (event: any) => {
        const form = await superValidate(event, zod4(loginSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        const { email, password } = form.data;
        const { error } = await login_user(email, password,  event.cookies);

       if (error) {
			setError(form, 'email', error);
			return fail(400, { form });
		}

        throw redirect(307, "/dashboard");
    }
};
