import {z} from 'zod'
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/model/User'
import { usernameValidation } from '@/schemas/signupSchema'

export async function POST(request:Request) {
    await dbConnect();

    try {

        const {username, code} = await request.json()

        const decodedUsername = decodeURIComponent(username)

        const user = await UserModel.findOne({
            username:decodedUsername
        })

        if(!user){
            return Response.json({
                success:false,
                message:"user does not exist with this username"
            } , {status:500})
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeNotExpired && isCodeValid){
            user.isVerified = true
            await user.save()
            return Response.json({
                success:true,
                message:"user verified successfully"
            } , {status:200})

            
        }
        else if(!isCodeNotExpired){
            return Response.json({
                success:false,
                message:"verification code expired"
            } , {status:500})
        }
        else{
            return Response.json({
                success:false,
                message:"verification code does not match"
            } , {status:500})
        }
         
    } catch (error) {
        console.log("error while verify user",error)
        return Response.json({
            success:false,
            message:"error verifying user"
        } , {status:500})
    }
}