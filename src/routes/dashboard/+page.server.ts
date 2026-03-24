import { User_Model } from "$lib/server/models";
import type { PageServerLoad } from "./$types";
import { authenticate } from "$lib/server/authenticate";

export const load: PageServerLoad = async ({ cookies }) => {
    try {
        const user = await User_Model.findById(authenticate(cookies)).select("name").lean();
        const firstName = user?.name?.trim().split(' ')[0];
        return { greeting: firstName && firstName.length <= 12 ? `Hi, ${firstName}!` : "Hey there!" };

    } catch (error) {
        return {
            error: "Something went wrong fetching your profile."
        };
    }
};