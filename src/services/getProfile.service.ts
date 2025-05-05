import { prisma } from "../config/database";
import { AppError } from "../utils/errorHandler";

export const getProfileService = async ({ userId, email }: { userId: string, email: string }) => {

    const user = await prisma.user.findUnique({
        where: { id: userId, email, deletedAt: null },
        select: { id: true, name: true, email: true },
    });

    if (!user) {
        throw new AppError({
            statusCode: 404,
            data: {},
            message: "User not found."
        })
    }

    return user
};