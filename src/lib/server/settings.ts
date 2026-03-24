
import { User_Model } from "./models";
import { authenticate } from "./authenticate";
import type { Cookies } from "@sveltejs/kit";

export async function returnName(cookies: Cookies) {
    const id = authenticate(cookies);
    const user = await User_Model.findById(id);
    return user?.name;
}

export async function updateName(newName: string | undefined, cookies: Cookies) {
    const id = authenticate(cookies);
    const user = await User_Model.findById(id);
    if (!user) return "You are an invalid user or are not authenicated. Try logging in again, maybe?";
    if (!newName) return "You are missing data.";
    if (user.name === newName) return "Your new name must be different from the current name.";
    await User_Model.updateOne({ _id: id }, { name: newName });
}
