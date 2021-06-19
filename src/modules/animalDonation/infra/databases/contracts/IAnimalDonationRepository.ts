import ICreateAnimalDonationDTO from '../../../dtos/ICreateAnimalDonationDTO';
import AnimalDonation from '../typeorm/entities/AnimalDonation';

export default interface IAnimalDonationRepository {
  findById(id: string): Promise<AnimalDonation | undefined>;
  findByUserId(id: string): Promise<AnimalDonation[]>;
  create(data: ICreateAnimalDonationDTO): Promise<AnimalDonation>;
  update(data: AnimalDonation): Promise<AnimalDonation>;
  delete(donationId: string): Promise<void>;
}
