import { FuelType, Transmission } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsEnum,
  IsNumber,
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

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export enum sortParameter {
  PRICE = "price",
  MILEAGE = "mileage",
  YEAR = "year",
}

export class CarSearchFilterDto {
  @IsOptional()
  @IsString()
  make?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  yearMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  yearMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priceMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priceMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  mileageMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  mileageMax?: number;

  @IsOptional()
  @IsEnum(sortParameter)
  sortParameter: sortParameter;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit: number = 10;
}
