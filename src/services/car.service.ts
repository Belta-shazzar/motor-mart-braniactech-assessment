import { Service } from "typedi";
import { ImageService } from "@/services/image.service";
import { AddCarListingDto, CarSearchFilterDto } from "@/dto/car.dto";
import { UserService } from "./user.service";
import { Car, Image, User, UserRole } from "@prisma/client";
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
    user: Partial<User>,
    listingDto: AddCarListingDto,
    files: Record<string, any>[]
  ): Promise<any> {
    return await prisma.$transaction(async (transaction) => {
      /*
    Extracting price to convert from
    decimal to string (for compatibility with prisma) before saving to database
    */
      const { price } = listingDto;

      const car: Car = await transaction.car.create({
        data: {
          ...listingDto,
          price: price.toString(),
          sellerId: user.id,
        },
      });

      const images: Partial<Image>[] | any = [];

      files.forEach((file) => {
        const { originalname, encoding, mimetype, path, size, filename } = file;
        const image: Partial<Image> = {
          carId: car.id,
          url: path,
          encoding,
          fileName: filename,
          originalName: originalname,
          mimeType: mimetype,
          size: size.toString(),
        };

        images.push(image);
      });

      await this.imageService.createImages(images, transaction);

      if (user.role !== UserRole.SELLER) {
        await this.userService.updateUser(user.id, { role: UserRole.SELLER });
      }

      return car;
    });
  }

  public async getCarDetails(carId: string): Promise<Partial<Car>> {
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
        images: {
          select: {
            id: true,
            url: true,
            fileName: true,
            originalName: true,
            mimeType: true,
          },
        },
      },
    });

    if (!car) throw new HttpException(httpStatus.NOT_FOUND, "Car not found");

    return car;
  }

  public async getCars(filter: CarSearchFilterDto) {
    const { page, limit } = filter;
    const skip = (page - 1) * limit;

    const where = this.constructSearchFilters(filter);

    const sortParameter = filter.sortParameter
      ? filter.sortParameter
      : "createdAt";
    const sortOrder = filter.sortOrder ? filter.sortOrder : "desc";

    const cars = await this.car.findMany({
      skip: skip,
      take: limit,
      where,
      orderBy: { [sortParameter]: sortOrder },
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

    return whereFilter;
  }
}
