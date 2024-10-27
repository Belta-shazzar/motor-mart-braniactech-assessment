import { FuelType, Transmission } from "@prisma/client";
import {
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsEnum,
  IsDecimal,
} from "class-validator";
import Decimal from "decimal.js-light";

export class AddCarListingDto {
  @IsNotEmpty()
  @IsString()
  make: string;

  @IsNotEmpty()
  @IsString()
  carModel: string;

  @IsNotEmpty()
  @IsInt()
  @Max(new Date().getFullYear()) // Ensures year isn’t in the future
  year: number;

  @IsNotEmpty()
  @IsString()
  color: string;

  @IsNotEmpty()
  @Min(0)
  mileage: number; // Kilometer

  @IsNotEmpty()
  @Min(0) // Prevents negative prices
  price: Decimal; //Naira

  @IsNotEmpty()
  @IsString()
  vin: string;

  @IsNotEmpty()
  @IsEnum(FuelType, { message: "fuelType must be a valid FuelType" })
  fuelType: FuelType; // Gasoline | Diesel | Electric | Hybrid

  @IsNotEmpty()
  @IsEnum(Transmission, {
    message: "transmission must be a either AUTOMATIC or MANUAL",
  })
  transmission: Transmission; // AUTOMATIC | MANUAL

  @IsOptional()
  @IsString()
  description?: string;
}
