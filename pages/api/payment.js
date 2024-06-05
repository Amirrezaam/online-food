import connectToDB from "@/configs/db";
import UserModel from '@/models/User'
import { generateToken, hashPassword, verifyPassword, verifyToken } from "@/utils/auth";
import { serialize } from "cookie";
import { Formidable, formidable } from "formidable";
import OrdersModel from '@/models/Orders.js'

const handler = async (req, res) => {

    if (req.method === "POST") {
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

            const orders = await OrdersModel.find({ user: user._id })

            orders.map(async (order) => {
                await OrdersModel.findByIdAndUpdate(order._id, {
                    $set: {
                        isPayment: 1
                    }
                })
            })

            return res.status(201).json({ message: "OK!!!!!!" })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

}

export default handler;