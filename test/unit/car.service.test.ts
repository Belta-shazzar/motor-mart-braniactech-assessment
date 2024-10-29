import { DeepMockProxy, mock, mockDeep, MockProxy } from "jest-mock-extended";
import { generateUUID } from "../util";
import { faker } from "@faker-js/faker";
import prisma from "../../src/config/prisma";
import {
  AvailabilityStatus,
  Car,
  FuelType,
  PrismaClient,
  Transmission,
  User,
  UserRole,
} from "@prisma/client";
import { CarService } from "../../src/services/car.service";
import { UserService } from "../../src/services/user.service";
import { ImageService } from "../../src/services/image.service";
import { Decimal } from "@prisma/client/runtime/library";
import {
  AddCarListingDto,
  CarSearchFilterDto,
  SortOrder,
  SortParameter,
} from "../../src/dto/car.dto";
import { HttpException } from "../../src/exceptions/http.exception";

// Mock prisma config module
jest.mock("../../src/config/prisma.ts", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

describe("BookingService unit test", () => {
  // Mocked prisma client
  const mockedPrisma = prisma as unknown as DeepMockProxy<PrismaClient>;

  let carService: CarService;

  // Mocked dependencies
  let userService: MockProxy<UserService>;
  let imageService: MockProxy<ImageService>;

  // Mocked user details
  const userId: string = generateUUID();
  const name: string = `${faker.person.firstName()} ${faker.person.lastName()}`;
  const email: string = faker.internet.email();
  const phoneNumber: string = faker.phone.number();

  const mockUser: User = {
    id: userId,
    name,
    email,
    phoneNumber,
    password: "hashedPassword",
    role: UserRole.BUYER,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  // Mocked car details
  const carId: string = generateUUID();

  const mockCarDto: AddCarListingDto = {
    make: "Test car make",
    carModel: "Test car model",
    year: 2020,
    color: "Blue",
    mileage: 40000,
    price: 400000,
    vin: "Vehicle Identification Number",
    fuelType: FuelType.Gasoline,
    transmission: Transmission.AUTOMATIC,
    description: "Your choice car",
  };

  const mockCar: Car = {
    id: carId,
    sellerId: mockUser.id,
    make: "Test car make",
    carModel: "Test car model",
    year: 2020,
    color: "Blue",
    mileage: 40000,
    vin: "Vehicle Identification Number",
    fuelType: FuelType.Gasoline,
    transmission: Transmission.AUTOMATIC,
    description: "Your choice car",
    price: new Decimal("400000"),
    availabilityStatus: AvailabilityStatus.AVAILABLE,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockFiles = [
    {
      fieldname: "images",
      originalname: "image.jpg",
      encoding: "7bit",
      mimetype: "image/jpeg",
      path: "https://url.jpg",
      size: 4750153,
      filename: "folder/fmptedtsbagmgz773szx",
    },
    {
      fieldname: "images",
      originalname: "image.jpg",
      encoding: "7bit",
      mimetype: "image/jpeg",
      path: "https://url.jpg",
      size: 4750153,
      filename: "folder/fmptedtsbagmgz773szx",
    },
  ];

  const mockImages = [
    {
      carId: mockCar.id,
      url: mockFiles[0].path,
      encoding: mockFiles[0].encoding,
      fileName: mockFiles[0].filename,
      originalName: mockFiles[0].originalname,
      mimeType: mockFiles[0].mimetype,
      size: mockFiles[0].size.toString(),
    },
    {
      carId: mockCar.id,
      url: mockFiles[1].path,
      encoding: mockFiles[1].encoding,
      fileName: mockFiles[1].filename,
      originalName: mockFiles[1].originalname,
      mimeType: mockFiles[1].mimetype,
      size: mockFiles[1].size.toString(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Instanciate mock dependencies
    userService = mock<UserService>();
    imageService = mock<ImageService>();

    carService = new CarService(userService, imageService);
  });

  describe("Add car listing cases", () => {
    it("should successfully add a car list with transaction", async () => {
      const mockTransaction = {
        car: {
          create: jest.fn().mockResolvedValue(mockCar),
        },
        image: {
          createManyAndReturn: jest.fn().mockResolvedValue([]),
        },
      };

      mockedPrisma.$transaction.mockImplementation((callback) =>
        callback(mockTransaction as any)
      );

      imageService.createImages.mockResolvedValue([]);

      userService.updateUser.mockResolvedValue();

      const result = await carService.addCarListing(
        mockUser,
        mockCarDto,
        mockFiles
      );

      // Assert
      expect(mockTransaction.car.create).toHaveBeenCalledWith({
        data: {
          ...mockCarDto,
          price: mockCarDto.price.toString(),
          sellerId: mockCar.sellerId,
        },
      });
      expect(imageService.createImages).toHaveBeenCalledWith(
        mockImages,
        mockTransaction
      );
      expect(userService.updateUser).toHaveBeenCalledWith(mockUser.id, {
        role: UserRole.SELLER,
      });

      expect(result).toEqual(mockCar);
    });

    it("should not update user role if already a seller", async () => {
      const sellerUser = { ...mockUser, role: UserRole.SELLER };

      const mockTransaction = {
        car: {
          create: jest.fn().mockResolvedValue(mockCar),
        },
        image: {
          createManyAndReturn: jest.fn().mockResolvedValue([]),
        },
      };

      mockedPrisma.$transaction.mockImplementation((callback) =>
        callback(mockTransaction as any)
      );

      imageService.createImages.mockResolvedValue([]);

      userService.updateUser.mockResolvedValue();

      const result = await carService.addCarListing(
        sellerUser,
        mockCarDto,
        mockFiles
      );

      expect(userService.updateUser).not.toHaveBeenCalled();
      expect(result).toEqual(mockCar);
    });
  });

  describe("Get car details cases", () => {
    const mockCarDetails: Partial<Car> | any = {
      make: "Test car make",
      carModel: "Test car model",
      year: 2020,
      color: "Blue",
      mileage: 40000,
      price: new Decimal("400000"),
      vin: "Vehicle Identification Number",
      fuelType: FuelType.Gasoline,
      transmission: Transmission.AUTOMATIC,
      description: "Your choice car",
      availabilityStatus: AvailabilityStatus.AVAILABLE,
      createdAt: new Date(),
      seller: {
        id: mockCar.sellerId,
        name: "Test Dealer",
        email: "dealer@test.com",
      },
      images: mockImages,
    };

    const selections = {
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
    };
    it("should return a car's details when car is found", async () => {
      mockedPrisma.car.findUnique.mockResolvedValue(mockCarDetails);

      // Execute getCarDetails
      const result = await carService.getCarDetails(carId);

      // Verify
      expect(mockedPrisma.car.findUnique).toHaveBeenCalledWith({
        where: { id: carId },
        select: selections,
      });
      expect(result).toEqual(mockCarDetails);
    });

    it("should throw HttpException when car is not found", async () => {
      mockedPrisma.car.findUnique.mockResolvedValue(null);

      // Execute and verify
      await expect(carService.getCarDetails(carId)).rejects.toThrow(
        new HttpException(404, "Car not found")
      );

      expect(mockedPrisma.car.findUnique).toHaveBeenCalledWith({
        where: { id: carId },
        select: selections,
      });
    });
  });

  describe("Get cars", () => {
    const filters: CarSearchFilterDto = {
      make: "Test car make",
      model: "Test car model",
      yearMin: 2020,
      yearMax: 2021,
      priceMin: 250000,
      priceMax: 260000,
      mileageMin: 40000,
      mileageMax: 41000,
      sortParameter: SortParameter.PRICE,
      sortOrder: SortOrder.DESC,
      page: 1,
      limit: 10,
    };
    it("should return paginated cars with default sorting", async () => {
      const count = 1;
      // Mock the car count
      mockedPrisma.car.count.mockResolvedValue(count);
      // Mock finding cars
      mockedPrisma.car.findMany.mockResolvedValue([mockCar]);

      const result = await carService.getCars(filters);

      expect(mockedPrisma.car.findMany).toHaveBeenCalledWith({
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
        where: expect.any(Object),
        orderBy: { [filters.sortParameter]: filters.sortOrder },
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

      expect(mockedPrisma.car.count).toHaveBeenCalledWith({
        where: expect.any(Object),
      });
      expect(result).toHaveProperty("data", [mockCar]);
      expect(result).toHaveProperty("count", count);
      expect(result).toHaveProperty("currentPage");
      expect(result).toHaveProperty("nextPage");
      expect(result).toHaveProperty("prevPage");
    });
  });
});
