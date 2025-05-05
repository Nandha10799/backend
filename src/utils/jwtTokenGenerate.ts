import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const jwtGenerateToken = ({
  userId, name, email
}: {
  userId: string,
  name: string,
  email: string,
}) => {
  return jwt.sign(
    { userId, name, email },
    process.env.JWT_SECRET as string,
    {
      algorithm: "HS512", // More secure than HS256
      // expiresIn: 86400, // 1 day = 24 * 60 * 60 = 86400 seconds
    }
  );
};
