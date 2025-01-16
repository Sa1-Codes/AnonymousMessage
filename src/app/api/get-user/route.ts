import {z} from 'zod'
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/model/User'
import { usernameValidation } from '@/schemas/signupSchema'


const UsernameQuerySchema = z.object({
    username:usernameValidation
})

export async function POST(request:Request) {
    await dbConnect();

    try {

        const {username} = await request.json()

        
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username:searchParams.get("username")
        }

        //validate with zod

        const result = UsernameQuerySchema.safeParse(queryParam)
        // console.log(result)

        // if (!result.success) {
        //     const usernameErrors = result.error.format().username?._errors  || []
        //     return Response.json({
        //         success:false,
        //         message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : "invalid query parameters"
        //     },{status:400})
        // }

        // const {username} = result.data

        const user = await UserModel.findOne({
            username
        })


        if(!user){
            return Response.json({
                success:false,
                message:"user not found"
            },{status:404})
        }

        return Response.json({
            user,
            success:true,
            message:"username is available" 
        },{status:200})



    } catch (error) {
        // console.log("error while checking the username",error)
        return Response.json({
            success:false,
            message:"error checking username"
        } , {status:500})
    }

}