import { prisma } from "../config/database";
import bcrypt from "bcrypt";

export const signupService = async ({ email, name, password }: {
    email: string,
    password: string,
    name: string,
}) => {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: email, deletedAt: null },
    });

    if (existingUser) {
        throw new Error("Email already registered");
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newCounsellor = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newCounsellor;

    return userWithoutPassword;
};