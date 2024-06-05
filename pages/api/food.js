import connectToDB from "@/configs/db";
import UserModel from '@/models/User'
import { generateToken, hashPassword, verifyPassword, verifyToken } from "@/utils/auth";
import { serialize } from "cookie";
import { Formidable, formidable } from "formidable";
import FoodModel from '@/models/Food.js'

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

            if (user.role !== "ADMIN") {
                return res.status(401).json({ message: "Unathorized !!!" });
            }

            const { name, price, img } = req.body.data

            await FoodModel.create({
                name,
                price,
                img,
            })
            return res.status(201).json({ message: "OK!!!!!!" })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    if (req.method === "GET") {
        try {

            connectToDB();

            const foods = await FoodModel.find({});

            return res.status(201).json({ message: "OK!!!!!!", data: foods })
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

            if (user.role !== "ADMIN") {
                return res.status(401).json({ message: "Unathorized !!!" });
            }
            const { _id, name, price, img } = req.body

            await FoodModel.findOneAndUpdate({ _id }, {
                name,
                price,
                img,
            })
            return res.status(200).json({ message: "OK!!!!!!" })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    if (req.method === "DELETE") {
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

            if (user.role !== "ADMIN") {
                return res.status(401).json({ message: "Unathorized !!!" });
            }

             await FoodModel.findOneAndDelete({ _id: req.query.id })
            return res.status(200).json({ message: "OK!!!!!!" })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

}

export default handler;