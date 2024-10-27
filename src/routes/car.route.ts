import { CarController } from "@/controllers/car.controller";
import { AddCarListingDto } from "@/dto/car.dto";
import { Routes } from "@/interfaces/routes.interface";
import AuthMiddleware from "@/middlewares/auth.middleware";
import InputValidationMiddleware from "@/middlewares/validation.middleware";
import { Router } from "express";

export class CarRoute implements Routes {
  path: string = "/api/cars";
  router: Router = Router();
  private carController = new CarController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      this.path,
      AuthMiddleware,
      InputValidationMiddleware(AddCarListingDto),
      this.carController.addCarListing
    );
  }
}
