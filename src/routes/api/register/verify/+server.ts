import type { RequestHandler } from './$types';
import { User_Model } from '$lib/server/models';

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

    // ===== FIND USER =====
    const user = await User_Model.findOne({ email });

    if (!user) {
        return new Response(
            JSON.stringify({
                codeError: 'Your code probably expired. Please try registering again.',
                go_back_btn: true
            }),
            { status: 400 }
        );
    }

    if (!user.code) {
        return new Response(
            JSON.stringify({
                codeError: 'This account is already verified. Try logging in instead.',
                go_back_btn: true
            }),
            { status: 400 }
        );
    }

    // ===== WRONG CODE =====
    if (user.code !== code) {
        const attempts = (user.attempts || 0) + 1;

        if (attempts >= 3) {
            await User_Model.deleteOne({ _id: user._id });

            return new Response(
                JSON.stringify({
                    codeError: 'Too many incorrect attempts. Please register again.',
                    go_back_btn: true
                }),
                { status: 400 }
            );
        }

        await User_Model.updateOne(
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

    // ===== SUCCESS =====
    await User_Model.updateOne(
        { _id: user._id },
        {
            $set: { verified: true },
            $unset: { code: '', ttl: '', attempts: '' }
        }
    );

    return new Response(
        JSON.stringify({
            codeError: '',
            go_back_btn: false
        })
    );
};