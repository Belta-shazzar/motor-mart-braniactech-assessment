import { CarSearchFilterDto } from "@/dto/car.dto";
import { CarService } from "@/services/car.service";
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import Container from "typedi";

export class CarController {
  private carService = Container.get(CarService);

  public addCarListing = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { user, body, files } = req;
      console.log("The files: ", files);

      const response = await this.carService.addCarListing(user, body, files);
      res.status(httpStatus.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getCars = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const searchFilters: CarSearchFilterDto = req.body;

      const response = await this.carService.getCars(searchFilters);
      res.status(httpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getCarDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const carId: string = req.params.carId;

      const response = await this.carService.getCarDetails(carId);
      res.status(httpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };
}
