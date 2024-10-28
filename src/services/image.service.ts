import prisma from "@/config/prisma";
import { Image } from "@prisma/client";
import { Service } from "typedi";

@Service()
export class ImageService {
  private image = prisma.image;

  public async createImages(
    images: Image[],
    transaction: any
  ): Promise<Image[]> {
    const createdImages = await transaction.image.createManyAndReturn({
      data: images,
    });

    return createdImages;
  }

  public async getImagesByCarId(carId: string): Promise<Partial<Image>[]> {
    return this.image.findMany({
      where: { carId },
      select: {
        id: true,
        carId: true,
        url: true,
        fileName: true,
        originalName: true,
        mimeType: true,
      },
    });
  }
}
