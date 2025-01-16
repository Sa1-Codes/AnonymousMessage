import {resend} from '@/lib/resend'
import VerificationEmail from '../../emails/VerificationEmail'

import { ApiResponse } from '@/types/ApiResponse'


export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse> {
    try {

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Anonymous Messaging | Verification Code',
            react: VerificationEmail({ username , otp:verifyCode}),
        });
        

        return {
            success:true,
            message:"Verification email successfully"
        }

    } catch (error) {
        // console.error("Error sending verification code",error)
        return {
            success:false,
            message:"failed to send verification message"
        }
    }
}