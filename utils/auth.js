import { hash, compare } from "bcryptjs"
import { sign, verify } from "jsonwebtoken"

const hashPassword = async (password) => {
    return await hash(password, 12);
}

const verifyPassword = async (password, hashedPassword) => {
    return await compare(password, hashedPassword);
}

const verifyToken = (token) => {
    try {
        const result = verify(token, process.env.privateKey);
        return result;
    } catch (error) {
        return false;
    }
}

const generateToken = async (data) => {
    const token = await sign({ ...data }, process.env.privateKey, {
        algorithm: "HS256",
        expiresIn: "24h" // 1 Day
    })

    return token;
}

export {
    hashPassword,
    generateToken,
    verifyPassword,
    verifyToken,
}