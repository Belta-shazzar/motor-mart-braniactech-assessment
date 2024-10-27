import { Service } from "typedi";
import { ImageService } from "@/services/image.service";
import { AddCarListingDto } from "@/dto/car.dto";
import { UserService } from "./user.service";
import { Car, User, UserRole } from "@prisma/client";
import prisma from "@/config/prisma";

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
}
