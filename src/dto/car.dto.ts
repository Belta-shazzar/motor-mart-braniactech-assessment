import "reflect-metadata";
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

export class AddCarListingDto {
  @IsNotEmpty()
  @IsString()
  make: string;

  @IsNotEmpty()
  @IsString()
  carModel: string;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @Max(new Date().getFullYear()) // Ensures year isn’t in the future
  year: number;

  @IsNotEmpty()
  @IsString()
  color: string;

  @IsNotEmpty()
  @Type(() => Number)
  @Min(0)
  mileage: number; // Kilometer

  @IsNotEmpty()
  @Type(() => Number)
  @Min(0) // Prevents negative prices
  price: number; //Naira

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

export enum SortParameter {
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
  @IsEnum(SortParameter)
  sortParameter: SortParameter;

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
