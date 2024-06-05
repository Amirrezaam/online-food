import connectToDB from "@/configs/db";
import UserModel from '@/models/User'
import { verifyToken } from "@/utils/auth";

const handler = async (req, res) => {

    if (req.method !== "GET") {
        return res.status(405).json({ message: "Not allowed method :((" })
    }

    try {
        connectToDB();

        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "You are not login !!" });
        }

        const tokenPayload = verifyToken(token);

        if (!tokenPayload) {
            return res.status(401).json({ message: "You are not login !!" });
        }

        const user = await UserModel.findOne({ number: tokenPayload.number, name: tokenPayload.name }, "name number role")

        if (!user) {
            return res.status(401).json({ message: "You are not login !!" });
        }

        return res.status(200).json({ data: user })

    } catch (err) {
        return res.status(500).json({ message: "Server Error :((" })
    }
}

export default handler;