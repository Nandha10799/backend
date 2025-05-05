import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { AppError } from "../utils/errorHandler";

dotenv.config();

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // 1. Check Authorization Header
    const authHeader = req.header("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2. Check token in body (JSON requests)
    if (!token && req.body?.token) {
      token = req.body.token;
    }

    // 3. Check token in query
    if (!token && req.query?.token) {
      token = req.query.token as string;
    }

    if (!token) {
      return next(
        new AppError({
          statusCode: 401,
          message: "Access Denied. No token provided.",
          data: {},
        })
      );
    }

    // 4. Verify Token
    jwt.verify(token, process.env.JWT_SECRET || "default_secret", (err, decoded) => {
      if (err) {
        let message = "Unauthorized: Invalid Token";
        if (err.name === "TokenExpiredError") message = "Unauthorized: Token Expired";
        if (err.name === "JsonWebTokenError") message = "Unauthorized: Malformed Token";

        return res.status(401).json({ success: false, message });
      }

      // 5. Store decoded data in request
      req.user = decoded as JwtPayload;
      next();
    });
  } catch (error) {
    console.error("❌ Token Middleware Error:", error);
    next(
      new AppError({
        statusCode: 500,
        message: "Internal Server Error",
        data: {},
      })
    );
  }
};
