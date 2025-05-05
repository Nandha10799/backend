import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { getProfileService } from "../services/getProfile.service";

export const getProfileController = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {

        const { userId, email } = req.user as { userId: string, email: string };

        const response = await getProfileService({ email, userId });

        res.status(200).json({
            status: true,
            ...response,
            message: "Profile fetched successfully",
        });
    } catch (error) {
        console.error("Failed to fetch profile", error);
        next(error);
    }
};