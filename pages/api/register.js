import connectToDB from "@/configs/db";
import UserModel from '@/models/User'
import { generateToken, hashPassword } from "@/utils/auth";
import { serialize } from "cookie";

const handler = async (req, res) => {

    if (req.method !== "POST") {
        return res.status(405).json({ message: "Not allowed method :((" })
    }

    try {
        connectToDB();

        const { name, number, password } = req.body;

        if (!name.trim() || !number.trim() || !password.trim()) {
            return res.status(422).json({ message: "Invalid Data !!!!" })
        }

        const isUserExist = await UserModel.findOne({ $or: [{ number }] })
        if (isUserExist) {
            return res.status(400).json({ message: "phone number has already taken ::((" })
        }

        const hashedPassword = await hashPassword(password);

        const token = await generateToken({ name, number });

        const usersCount = (await UserModel.find({})).length

        const user = await UserModel.create({
            name,
            number,
            password: hashedPassword,
            role: usersCount > 0 ? "USER" : "ADMIN"
        })

        return res
            .setHeader("Set-Cookie", serialize("token", token, {
                path: "/",
                httpOnly: true,
                maxAge: 60 * 60 * 24 // 1 Day
            }))
            .status(201)
            .json({
                message: "Register Success :)))",
                user: {
                    name,
                    role: user.role
                }
            })

    } catch (err) {
        return res.status(500).json({ message: "Server Error :((" })
    }
}

export default handler;