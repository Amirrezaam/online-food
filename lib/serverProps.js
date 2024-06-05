import connectToDB from "@/configs/db";
import { verifyToken } from "@/utils/auth";
import UserModel from '@/models/User'

export default async function getServerSideProps(context) {
    const { token } = context.req.cookies;

    if (!token) {
        return false;
    }

    connectToDB();

    const tokenPayload = verifyToken(token);

    if (!tokenPayload) {
        return false;
    }

    const user = await UserModel.findOne({ number: tokenPayload.number, name: tokenPayload.name });
    if (!user) {
        return false;
    }

    return user
}