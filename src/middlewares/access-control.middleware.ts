import { HttpException } from "@/exceptions/http.exception";
import { RequestWithUser } from "@/interfaces/auth.interface";
import { UserRole } from "@prisma/client";
import { Response, NextFunction } from "express";
import httpStatus from "http-status";

// Middleware to check user roles
export const authorize = (...requiredRoles: UserRole[]) => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      throw new HttpException(
        httpStatus.UNAUTHORIZED,
        "You are not authorized to access this resource"
      );
    }

    if (!user || !requiredRoles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};
