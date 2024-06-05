import connectToDB from "@/configs/db";
import { serialize } from "cookie";

const handler = async (req, res) => {

    if (req.method !== "POST") {
        return res.status(405).json({ message: "Not allowed method :((" })
    }

    try {
        connectToDB();

        return res
            .setHeader("Set-Cookie", serialize("token", "", {
                path: "/",
                maxAge: -1
            }))
            .status(200)
            .json({
                message: "Signout Success :)))",
            })

    } catch (err) {
        return res.status(500).json({ message: "Server Error :((" })
    }
}

export default handler;