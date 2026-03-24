import { superValidate } from "sveltekit-superforms/server";
import { zod4 } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { create_request, verify_request } from "$lib/server/modify-delete";
import { modifyDeleteSchema } from "$lib/validation";
import { setError } from "sveltekit-superforms/server";


export const load: PageServerLoad = async () => {
    const form = await superValidate(zod4(modifyDeleteSchema));
    return { form };
}

export const actions = {
    modifyDelete: async (event: any) => {
        const form = await superValidate(event, zod4(modifyDeleteSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        const { email, newEmail, type, password } = form.data;
        const { error } = await create_request(email, newEmail, type, password, event.cookies);

        if (error) {
            setError(form, 'email', error);
            return fail(400, { form });
        }

        // Returning result to render email in frontend.
        return { form };
    },

    code: async (event: any) => {
        const code = (await event.request.formData()).get("code") as string;
        const { error, go_back_btn } = await verify_request(code, event.cookies);

        if (error) {
            return { error, go_back_btn };
        }

        throw redirect(307, "/login");
    }


};
