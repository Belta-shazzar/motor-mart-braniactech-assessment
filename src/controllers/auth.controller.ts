import { SignInDto, SignUpDto } from "@/dto/auth.dto";
import { AuthData, RequestWithUser } from "@/interfaces/auth.interface";
import { AuthService } from "@/services/auth.service";
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import Container from "typedi";

export class AuthController {
  private authService = Container.get(AuthService);

  public signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: SignUpDto = req.body;
      const response: AuthData = await this.authService.signUp(userData);

      res.status(httpStatus.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  };
  public signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: SignInDto = req.body;
      const response = await this.authService.signIn(userData);

      res.status(httpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getAuthenticatedUser = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    res.status(httpStatus.OK).json({ user: req.user });
  };
}
