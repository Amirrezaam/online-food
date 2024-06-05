import connectToDB from "@/configs/db";
import UserModel from '@/models/User'
import { generateToken, hashPassword, verifyPassword } from "@/utils/auth";
import { serialize } from "cookie";

const handler = async (req, res) => {

    if (req.method !== "POST") {
        return res.status(405).json({ message: "Not allowed method :((" })
    }

    try {
        connectToDB();

        const { number, password } = req.body;

        if (!number.trim() || !password.trim()) {
            return res.status(422).json({ message: "Invalid Data !!!!" })
        }

        const user = await UserModel.findOne({ $or: [{ number }] })
        if (!user) {
            return res.status(404).json({ message: "User not found :((" })
        }

        const isValidPassword = await verifyPassword(password, user.password);

        if (!isValidPassword) {
            res.status(422).json({ message: "Username or password is not correct !!" })
        }

        const token = await generateToken({ number: user.number, name: user.name });

        return res
            .setHeader("Set-Cookie", serialize("token", token, {
                path: "/",
                httpOnly: true,
                maxAge: 60 * 60 * 24 // 1 Day
            }))
            .status(200)
            .json({
                message: "Login Success :)))",
                user: {
                    name: user.name,
                    role: user.role
                }
            })

    } catch (err) {
        return res.status(500).json({ message: "Server Error :((" })
    }
}

export default handler;