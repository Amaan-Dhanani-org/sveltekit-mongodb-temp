import type { RequestHandler } from './$types';
import { User_Model, ChangeCreds_Model, Session_Model } from '$lib/server/models';
import { deleteUser } from '$lib/server/utils';

export const POST: RequestHandler = async ({ request }) => {
    const { email, code } = await request.json();

    // ===== BASIC VALIDATION =====
    if (!email) {
        return new Response(
            JSON.stringify({
                codeError: 'Something went wrong. Please try again.', go_back_btn: true
            }), { status: 400 });
    }

    if (!code || code.length !== 6) {
        return new Response(
            JSON.stringify({
                codeError: 'Your code must be six characters.',
                go_back_btn: false
            }),
            { status: 400 }
        );
    }


    const user = await ChangeCreds_Model.findOne({ email });

    if (!user) {
        return new Response(
            JSON.stringify({
                codeError: 'Your code probably expired. Please try again.',
                go_back_btn: true
            }),
            { status: 400 }
        );
    }

    // ===== WRONG CODE =====
    if (user.code !== code) {
        const attempts = (user.attempts || 0) + 1;

        if (attempts >= 3) {
            await ChangeCreds_Model.deleteOne({ _id: user._id });

            return new Response(
                JSON.stringify({
                    codeError: 'Too many incorrect attempts. Please try again.',
                    go_back_btn: true
                }),
                { status: 400 }
            );
        }

        await ChangeCreds_Model.updateOne(
            { _id: user._id },
            { $set: { attempts } }
        );

        return new Response(
            JSON.stringify({
                codeError: `Incorrect code. You have ${3 - attempts} attempt${3 - attempts === 1 ? '' : 's'
                    } left.`,
                go_back_btn: false
            }),
            { status: 400 }
        );
    }

    const temp = await User_Model.findOne({ email });
    if (temp) { await Session_Model.deleteOne({ userId: temp._id.toString()}) };


    if (user.type === 'Change Password') {
        await User_Model.updateOne({ email }, { $set: { password: user.password } });
    }
    else if (user.type === 'Change Email') {
        await User_Model.updateOne({ email }, { $set: { email: user.newEmail } });
    }
    else if (user.type === 'Delete Account') {
        deleteUser(email);
    }

    await ChangeCreds_Model.deleteOne({ _id: user._id });
        

     return new Response(
        JSON.stringify({
            codeError: '',
            go_back_btn: false
        })
    );
};
