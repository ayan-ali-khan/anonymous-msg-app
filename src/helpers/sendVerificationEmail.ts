import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Mystery Message App - Verify Your Email',
            text: `Hello ${username}, your verification code is ${verifyCode}`
            // react: VerificationEmail({username, otp: verifyCode}),
        });

        return {success: true, message: "Verification email sent successfully."}
        
    } catch (error:any) {
        console.error("Error sending verification email", error?.message, error?.stack)
        return {success: false, message: "Failed to send verification email."}
    }
}