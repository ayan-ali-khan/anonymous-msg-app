import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/User";

export async function POST(request: Request){
    await dbConnect()

    const {username, content} = await request.json()

    try {
        const user = await UserModel.findOne({username});
        if(!user){
            return Response.json({
                success: false, message: "User not found."
            }, {status: 401})
        }

        if(!user.isAcceptingMessage){
            return Response.json({
                success: false, message: "User not accepting messages."
            }, {status: 403})
        }

        const newMessage = {content, createdAt: new Date()}
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json({
            success: true, message: "Mesage sent successfully"
        }, {status: 200})
    } catch (error) {
        console.error("Error sending message", error);
        return Response.json({
            success: false, message: "Error sending message. Internal server error"
        }, {status: 500})
    }
}