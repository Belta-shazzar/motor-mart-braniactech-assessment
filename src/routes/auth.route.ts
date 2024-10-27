import { AuthController } from "@/controllers/auth.controller";
import { SignInDto, SignUpDto } from "@/dto/auth.dto";
import { Routes } from "@/interfaces/routes.interface";
import AuthMiddleware from "@/middlewares/auth.middleware";
import InputValidationMiddleware from "@/middlewares/validation.middleware";
import { Router } from "express";

export class AuthRoute implements Routes {
  path: string = "/api/auth";
  router: Router = Router();
  private authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/sign-up`,
      InputValidationMiddleware(SignUpDto),
      this.authController.signup
    );

    this.router.post(
      `${this.path}/sign-in`,
      InputValidationMiddleware(SignInDto),
      this.authController.signin
    );

    this.router.get(
      `${this.path}/authenticated`,
      AuthMiddleware,
      this.authController.getAuthenticatedUser
    );
  }
}
