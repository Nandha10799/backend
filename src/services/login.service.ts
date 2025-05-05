import { prisma } from "../config/database";
import { AppError } from "../utils/errorHandler";
import bcrypt from "bcrypt";
import { jwtGenerateToken } from "../utils/jwtTokenGenerate";

export const loginService = async ({ email, password }: {
    email: string,
    password: string,
}) => {
    if (!email || !password) {
        throw new AppError({
            statusCode: 400,
            data: {},
            message: "Email and password are required."
        });
    }

    const user = await prisma.user.findUnique({
        where: { email, deletedAt: null },
        select: { id: true, name: true, email: true, password: true },
    });

    if (!user) {
        throw new AppError({
            statusCode: 401,
            data: {},
            message: "Unauthorized: Invalid Email Address."
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AppError({
            statusCode: 401,
            data: {},
            message: "Unauthorized: Invalid Password."
        });
    }

    // Ensure JWT Secret is available
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new AppError({
            statusCode: 500,
            data: {},
            message: "Internal Server Error: Missing JWT secret."
        });
    }

    // Generate JWT Token
    const token = jwtGenerateToken({
        userId: user.id,
        name: user.name,
        email: user.email,
    });

    return {
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            token,
        },
    };
};