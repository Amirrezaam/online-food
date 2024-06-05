import connectToDB from "@/configs/db";
import UserModel from '@/models/User'
import { verifyToken } from "@/utils/auth";
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

            const user = await UserModel.findOne({ number: tokenPayload.number, name: tokenPayload.name })

            if (!user) {
                return res.status(401).json({ message: "You are not login !!" });
            }

            const userHaveOrder = await OrdersModel.findOne({ user: user._id });

            const { food: { _id, name, img, price } } = req.body

            const order = await OrdersModel.create({
                user: user._id,
                food: _id,
                img,
                name,
                price,
                count: 1,
                isPayment: 0
            })

            return res.status(201).json({ message: "OK!!!!!!" })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    if (req.method === "GET") {
        try {

            const { token } = req.cookies;

            if (!token) {
                return res.status(401).json({ message: "You are not login !!" });
            }

            const tokenPayload = verifyToken(token);

            if (!tokenPayload) {
                return res.status(401).json({ message: "You are not login !!" });
            }

            const user = await UserModel.findOne({ number: tokenPayload.number, name: tokenPayload.name })

            if (!user) {
                return res.status(401).json({ message: "You are not login !!" });
            }

            connectToDB();

            const orders = await OrdersModel.find({ user: user._id, isPayment: false });
            let countOrders = 0;
            let sumPrice = 0;
            orders.map(order => {
                sumPrice += order.price * order.count;
                countOrders += order.count;
            })

            return res.status(200).json({ message: "OK!!!!!!", orders, sumPrice, countOrders })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    if (req.method === "PUT") {
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

            const { info: { _id, action } } = req.body

            if (action === "INC") {
                const userOrder = await OrdersModel.findOne({ user: user._id, food: _id, isPayment: false });

                await OrdersModel.findOneAndUpdate({ user: user._id, food: _id, isPayment: false }, { $set: { count: userOrder.count + 1 } });

                return res.status(200).json({ message: "OK!!!!!!" })
            }

            if (action === "DEC") {
                const userOrder = await OrdersModel.findOne({ user: user._id, food: _id, isPayment: false });

                if (userOrder.count === 1) {
                    await OrdersModel.findOneAndDelete({ user: user._id, food: _id, isPayment: false });
                    return res.status(200).json({ message: "OK!!!!!!" })

                }

                await OrdersModel.findOneAndUpdate({ user: user._id, food: _id, isPayment: false }, { $set: { count: userOrder.count - 1 } });

                return res.status(200).json({ message: "OK!!!!!!" })
            }



        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

}

export default handler;