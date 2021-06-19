import ICreateAnimalImageDTO from '@modules/animalDonation/dtos/ICreateAnimalImageDTO';
import { getRepository, Repository } from 'typeorm';

import IAnimalImageRepository from '../../contracts/IAnimalImageRepository';

import AnimalImage from '../entities/AnimalImage';

class AnimalImageRepository implements IAnimalImageRepository {
  private ormRepository: Repository<AnimalImage>;

  constructor() {
    this.ormRepository = getRepository(AnimalImage);
  }

  public async create(data: ICreateAnimalImageDTO[]): Promise<AnimalImage[]> {
    const animalImages = this.ormRepository.create(data);

    return this.ormRepository.save(animalImages);
  }

  public async deleteById(
    userId: string,
    donationId: string,
    imageId: string,
  ): Promise<number | null | undefined> {
    const deleteResult = await this.ormRepository.query(
      `
      DELETE
      FROM "AnimalImage" as ai
      USING "AnimalDonation" as ad
      WHERE
        ai."AnimalDonationId" = ad."Id"
            AND
        ai."Id" = $1
            AND
        ad."Id" = $2
            AND
        ad."UserId" = $3;
    `,
      [imageId, donationId, userId],
    );

    return deleteResult[1];
  }

  public async delete(
    userId: string,
    donationId: string,
  ): Promise<number | null | undefined> {
    const deleteResult = await this.ormRepository.query(
      `
      DELETE
      FROM "AnimalImage" as ai
      USING "AnimalDonation" as ad
      WHERE
        ai."AnimalDonationId" = ad."Id"
            AND
        ad."Id" = $1
            AND
        ad."UserId" = $2;
    `,
      [donationId, userId],
    );

    return deleteResult[1];
  }
}

export default AnimalImageRepository;
