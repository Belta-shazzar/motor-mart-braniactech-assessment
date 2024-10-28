import { PrismaClient, User, UserRole } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import httpStatus from "http-status";
import { HttpException } from "../../src/exceptions/http.exception";
import prisma from "../../src/config/prisma";
import { UserService } from "../../src/services/user.service";
import { SignUpDto } from "../../src/dto/auth.dto";
import { faker } from "@faker-js/faker";
import { generateUUID } from "../util";

// Mock the prisma config module
jest.mock("../../src/config/prisma.ts", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

const mockedPrisma = prisma as unknown as DeepMockProxy<PrismaClient>;

describe("UserService unit test", () => {
  let userService: UserService;

  //Mocked user details
  const userId: string = generateUUID();
  const email: string = faker.internet.email();
  const name: string = `${faker.person.firstName()} ${faker.person.lastName()}`;
  const phoneNumber: string = faker.phone.number();

  const expectedUser: User = {
    id: userId,
    name,
    email,
    password: "hashedPassword",
    phoneNumber,
    role: UserRole.BUYER,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    userService = new UserService();
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      const signUpDto: SignUpDto = {
        email,
        name,
        phoneNumber,
        password: "password",
      };

      mockedPrisma.user.create.mockResolvedValue(expectedUser);

      const result = await userService.createUser(signUpDto);

      expect(mockedPrisma.user.create).toHaveBeenCalledWith({
        data: { ...signUpDto, role: UserRole.BUYER },
      });
      expect(result).toEqual(expectedUser);
    });
  });

  describe("getUserByEmail", () => {
    it("should return a user when found", async () => {
      mockedPrisma.user.findUnique.mockResolvedValue(expectedUser);

      const result = await userService.findByEmail(email);

      expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toEqual(expectedUser);
    });

    it("should return null when user is not found", async () => {
      mockedPrisma.user.findUnique.mockResolvedValue(null);

      const result = await userService.findByEmail(email);

      expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toBeNull();
    });
  });

  describe("getUserById", () => {
    it("should return a user when found", async () => {
      mockedPrisma.user.findUnique.mockResolvedValue(expectedUser);

      const result = await userService.findById(userId);

      expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toEqual(expectedUser);
    });

    it("should throw HttpException when user is not found", async () => {
      mockedPrisma.user.findUnique.mockResolvedValue(null);

      await expect(userService.findById(userId)).rejects.toThrow(
        new HttpException(httpStatus.NOT_FOUND, "User does not exist")
      );

      expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });

  describe("stripUserPassword", () => {
    it("should remove password from user object", () => {
      const expectedStrippedUser: Partial<User> = {
        id: userId,
        name,
        email,
        phoneNumber,
        role: UserRole.BUYER,
        createdAt: expectedUser.createdAt,
        updatedAt: expectedUser.updatedAt,
        deletedAt: null,
      };

      const result = userService.stripUserPassword(expectedUser);

      expect(result).not.toHaveProperty("password");
      expect(result).toEqual(expectedStrippedUser);
    });
  });

  describe("UpdateUser", () => {
    it("should update user role", async () => {
      const updatedUser: User = {
        ...expectedUser,
        role: UserRole.SELLER,
      };

      mockedPrisma.user.update.mockResolvedValue(updatedUser);

      const data = { role: UserRole.SELLER };
      const result = await userService.updateUser(expectedUser.id, data);

      expect(mockedPrisma.user.update).toHaveBeenCalledWith({
        where: { id: expectedUser.id },
        data,
      });
    });
  });
});
