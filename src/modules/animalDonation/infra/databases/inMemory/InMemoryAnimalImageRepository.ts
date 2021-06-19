import ICreateAnimalImageDTO from '@modules/animalDonation/dtos/ICreateAnimalImageDTO';
import { v4 as uuid } from 'uuid';

import IAnimalImageRepository from '../contracts/IAnimalImageRepository';

import AnimalImage from '../typeorm/entities/AnimalImage';

class InMemoryAnimalImageRepository implements IAnimalImageRepository {
  private animalImages: AnimalImage[] = [];

  public async create(data: ICreateAnimalImageDTO[]): Promise<AnimalImage[]> {
    data.forEach(image => {
      const animalImage = new AnimalImage();
      Object.assign(
        animalImage,
        { id: uuid() },
        image.fileName,
        image.animalDonationId,
      );

      this.animalImages.push(animalImage);
    });

    return this.animalImages;
  }

  public async deleteById(
    userId: string,
    donationId: string,
    imageId: string,
  ): Promise<number> {
    const imageIndex = this.animalImages.findIndex(
      image => image.id === imageId && image.animalDonationId === donationId,
    );

    let rowsAffected = 0;

    if (imageIndex > -1) {
      rowsAffected = 1;
      this.animalImages.splice(imageIndex, 1);
    }

    return rowsAffected;
  }

  public async delete(userId: string, donationId: string): Promise<number> {
    const filteredArray = this.animalImages.filter(
      image => image.animalDonationId !== donationId,
    );

    const rowsAffected = this.animalImages.length - filteredArray.length;

    this.animalImages = filteredArray;

    return rowsAffected;
  }
}

export default InMemoryAnimalImageRepository;
