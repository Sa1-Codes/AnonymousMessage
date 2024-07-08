import {z} from 'zod'
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/model/User'
import { usernameValidation } from '@/schemas/signupSchema'


const UsernameQuerySchema = z.object({
    username:usernameValidation
})

export async function GET(request:Request) {
    await dbConnect();

    try {
        
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username:searchParams.get("username")
        }

        //validate with zod

        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result)

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors  || []
            return Response.json({
                success:false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : "invalid query parameters"
            },{status:400})
        }

        const {username} = result.data

        const existingVerifiedUser = await UserModel.findOne({
            username,isVerified:true
        })

        if(existingVerifiedUser){
            return Response.json({
                success:false,
                message: "Username already exist"
            },{status:400})
        }

        return Response.json({
            success:true,
            message:"username is available" 
        },{status:200})



    } catch (error) {
        console.log("error while checking the username",error)
        return Response.json({
            success:false,
            message:"error checking username"
        } , {status:500})
    }

}