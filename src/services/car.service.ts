import { Service } from "typedi";
import { ImageService } from "@/services/image.service";
import { AddCarListingDto, CarSearchFilterDto } from "@/dto/car.dto";
import { UserService } from "./user.service";
import { Car, User, UserRole } from "@prisma/client";
import prisma from "@/config/prisma";
import { paginateResponse } from "@/utils/pagination";
import Decimal from "decimal.js-light";
import { HttpException } from "@/exceptions/http.exception";
import httpStatus from "http-status";

@Service()
export class CarService {
  private car = prisma.car;
  constructor(
    private userService: UserService,
    private imageService: ImageService
  ) {}

  public async addCarListing(
    listingDto: AddCarListingDto,
    user: Partial<User>
  ): Promise<Car> {
    /*
    Extracting price to convert from
    decimal to string (for compatibility with prisma) before saving to database
    */
    const { price } = listingDto;

    const car: Car = await this.car.create({
      data: {
        ...listingDto,
        price: price.toString(),
        sellerId: user.id,
      },
    });

    //TODO: Upload images with car ID

    if (user.role !== UserRole.SELLER) {
      await this.userService.updateUser(user.id, { role: UserRole.SELLER });
    }

    return car;
  }

  public async getCarDetails(carId: string) {
    const car = await this.car.findUnique({
      where: { id: carId },
      select: {
        make: true,
        carModel: true,
        year: true,
        color: true,
        mileage: true,
        price: true,
        vin: true,
        fuelType: true,
        transmission: true,
        description: true,
        availabilityStatus: true,
        createdAt: true,
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        images: true,
      },
    });

    if (!car) throw new HttpException(httpStatus.NOT_FOUND, "Car not found");

    return car;
  }

  public async getCars(filter: CarSearchFilterDto) {
    const { page, limit } = filter;
    const skip = (page - 1) * limit;

    const where = this.constructSearchFilters(filter);

    const cars = await this.car.findMany({
      skip: skip,
      take: limit,
      where,
      orderBy: { [filter.sortParameter]: filter.sortOrder },
      select: {
        id: true,
        make: true,
        carModel: true,
        year: true,
        price: true,
        mileage: true,
        transmission: true,
      },
    });

    const count = await this.car.count({ where });

    return paginateResponse([cars, count], page, limit);
  }

  private constructSearchFilters(filter: CarSearchFilterDto) {
    const whereFilter: any = {
      AND: [],
    };

    const {
      make,
      model,
      yearMin,
      yearMax,
      priceMin,
      priceMax,
      mileageMin,
      mileageMax,
    } = filter;

    if (make)
      whereFilter.AND.push({ make: { contains: make, mode: "insensitive" } });
    if (model)
      whereFilter.AND.push({
        carModel: { contains: model, mode: "insensitive" },
      });
    if (yearMin !== undefined) whereFilter.AND.push({ year: { gte: yearMin } });
    if (yearMax !== undefined) whereFilter.AND.push({ year: { lte: yearMax } });
    if (priceMin !== undefined)
      whereFilter.AND.push({ price: { gte: new Decimal(priceMin) } });
    if (priceMax !== undefined)
      whereFilter.AND.push({ price: { lte: new Decimal(priceMax) } });
    if (mileageMin !== undefined)
      whereFilter.AND.push({ mileage: { gte: mileageMin } });
    if (mileageMax !== undefined)
      whereFilter.AND.push({ mileage: { lte: mileageMax } });

    console.dir(whereFilter, { depth: null });
    return whereFilter;
  }
}
