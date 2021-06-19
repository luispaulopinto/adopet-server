import ICreateAnimalImageDTO from '@modules/animalDonation/dtos/ICreateAnimalImageDTO';
import AnimalImage from '../typeorm/entities/AnimalImage';

export default interface IAnimalImageRepository {
  create(data: ICreateAnimalImageDTO[]): Promise<AnimalImage[]>;

  deleteById(
    userId: string,
    donationId: string,
    imageId: string,
  ): Promise<number | null | undefined>;

  delete(
    userId: string,
    donationId: string,
  ): Promise<number | null | undefined>;
}
