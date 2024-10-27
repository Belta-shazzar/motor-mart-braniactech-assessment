import { AddCarListingDto } from "@/dto/car.dto";
import { RequestWithUser } from "@/interfaces/auth.interface";
import { CarService } from "@/services/car.service";
import { Response, NextFunction } from "express";
import httpStatus from "http-status";
import Container from "typedi";

export class CarController {
  private carService = Container.get(CarService);

  public addCarListing = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // TODO: Add implementation for image upload
      const carData: AddCarListingDto = req.body;
      const { user } = req;

      const response = await this.carService.addCarListing(carData, user);
      res.status(httpStatus.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  };
}
