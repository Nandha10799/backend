import { NextFunction, Request, Response } from "express";
import { signupService } from "../services/signup.service";

export const signupController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body)

        const { email, name, password } = req.body as {
            email: string,
            name: string,
            password: string,
        };

        const response = await signupService({ email, name, password });

        res.status(201).json({
            status: true,
            user: response,
            message: "Signup successful"
        });
    } catch (error) {
        next(error)
    }
};