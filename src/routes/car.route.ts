import Upload from "@/middlewares/upload.middleware";
import { CarController } from "@/controllers/car.controller";
import { AddCarListingDto, CarSearchFilterDto } from "@/dto/car.dto";
import { Routes } from "@/interfaces/routes.interface";
import AuthMiddleware from "@/middlewares/auth.middleware";
import InputValidationMiddleware, {
  RequestTarget,
} from "@/middlewares/validation.middleware";
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
      Upload.array("images", 10),
      InputValidationMiddleware(AddCarListingDto),
      this.carController.addCarListing
    );

    this.router.get(`${this.path}/:carId`, this.carController.getCarDetails);

    this.router.get(
      this.path,
      InputValidationMiddleware(CarSearchFilterDto, RequestTarget.QUERY),
      this.carController.getCars
    );
  }
}
