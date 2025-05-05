import { NextFunction, Request, Response } from "express";
import { loginService } from "../services/login.service";

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { email, password } = req.body as { email: string, password: string };

        const response = await loginService({ email, password });

        res.status(200).json({
            status: true,
            ...response,
            message: "Login successful",
        });
    } catch (error) {
        console.error("Failed to login", error);
        next(error);
    }
};