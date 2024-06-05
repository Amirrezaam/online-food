import connectToDB from "@/configs/db";
import UserModel from '@/models/User'
import { generateToken, verifyToken } from "@/utils/auth";
import { serialize } from "cookie";

const handler = async (req, res) => {

    if (req.method === "GET") {
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

        if (user.role !== "ADMIN") {
            return res.status(401).json({ message: "Unathorized !!!" });
        }

        const users = await UserModel.find({});

        return res.status(200).json({ users });
    }

    if (req.method === "PUT") {
        try {
            connectToDB();
            const { token } = req.cookies;
            const { name, number } = req.body;

            if (!token) {
                return res.status(401).json({ message: "Unathorized !" });
            }

            const tokenPayload = verifyToken(token);

            if (!tokenPayload) {
                return res.status(401).json({ message: "Unathorized !" });
            }

            if (tokenPayload.number !== number) {
                const isNumberExist = await UserModel.findOne({ $or: [{ number }] })
                if (isNumberExist) {
                    return res.status(400).json({ message: "phone number has already taken ::((" })
                }
            }

            const user = await UserModel.findOne({ number: tokenPayload.number, name: tokenPayload.name });

            if (!user) {
                return res.status(401).json({ message: "Unathorized !" });
            }


            const { _id, action, role } = req.body

            if (action === "CHANGE_ROLE") {
                console.log("CHANGE_ROLE")
                if (user.role !== "ADMIN") {
                    return res.status(401).json({ message: "Unathorized !" });
                }

                await UserModel.findOneAndUpdate({ _id }, { $set: { role } })

                return res.status(200).json({ message: "OK !!!!" })

            }


            await UserModel.findOneAndUpdate({ _id: user._id }, { $set: { name, number } })

            const newToken = await generateToken({ number: user.number, name });

            return res
                .setHeader("Set-Cookie", serialize("token", newToken, {
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


}

export default handler;