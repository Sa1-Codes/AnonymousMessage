import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request:Request) {
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user:User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not Authentication"
        } , {status:401})
    }

    const userId = user._id
    const {acceptMessages} = await request.json()

    try {
        const updateUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage:acceptMessages},
            {new :true}
        )

        if (!updateUser) {
            return Response.json({
                success:false,
                message:"failed in updating the user accept message"
            } , {status:500})
        }

        return Response.json({
            success:true,
            message:"message acceptance status updates successfully",
            updateUser
        } , {status:500})

    } catch (error) {
        return Response.json({
            success:false,
            message:"failed to update user status to accept message"
        } , {status:500})
    }

}

export async function GET(request:Request) {
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user:User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not Authentication"
        } , {status:401})
    }

    const userId = user._id
    try {
        const foundUser = await UserModel.findById(userId)
    
        if(!foundUser){
            return Response.json({
                success:false,
                message:"user not found"
            } , {status:400})
        }
    
        return Response.json({
            success:false,
            isAcceptingMessages : foundUser.isAcceptingMessage,
            
        } , {status:200})
    } catch (error) {
        console.log("error while finding the user" , error)
        return Response.json({
            success:false,
            message:"error in getting the message acceptance status"
        } , {status:500})
    }
}