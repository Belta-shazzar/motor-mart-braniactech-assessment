import { faker } from "@faker-js/faker";
import { Car, PrismaClient, User, UserRole } from "@prisma/client";
import { hash } from "bcrypt";
import { sampleCars } from "./seed.data";

const prisma = new PrismaClient();

async function main(): Promise<any> {
  console.log("==Seeder initialized==");

  // Generate and seed user data
  const userData: any = await generateFiveUsers();

  const users: any = await prisma.user.createManyAndReturn({
    data: userData,
    skipDuplicates: true,
  });

  // Generate and create cars for users
  const carData: any = generateCarsForEachUser(users);
  await prisma.car.createManyAndReturn({
    data: carData,
  });

  console.log("==Seeder completed==");
}

async function generateFiveUsers() {
  const users: Partial<User>[] = [];

  for (let i = 0; i < 5; i++) {
    const user = {
      name: `${faker.person.firstName()} ${faker.person.lastName()}`,
      email: faker.internet.email(),
      password: await hash("password", 10),
      phoneNumber: faker.phone.number(),
      role: UserRole.SELLER,
    };

    users.push(user);
  }
  return users;
}

function generateCarsForEachUser(users: User[]) {
  const cars: any = [];

  users.forEach((user) => {
    const count: number = getRandomNumberFrom0toSpecified(10);
    for (let i = 0; i < count; i++) {
      const carIndex = getRandomNumberFrom0toSpecified(sampleCars.length - 1);
      const car = { ...sampleCars[carIndex], sellerId: user.id };
      cars.push(car);
    }
  });

  return cars;
}

function getRandomNumberFrom0toSpecified(specified: number): number {
  return Math.floor(Math.random() * (specified - 0 + 1)) + 0;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
