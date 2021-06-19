import IFindAnimalDonationsDTO from '@modules/animalDonation/dtos/IFindAnimalDonationsDTO';
import IFindAnimalDonationsRespDTO from '@modules/animalDonation/dtos/IFindAnimalDonationsRespDTO';
import ICreateAnimalDonationDTO from '../../../dtos/ICreateAnimalDonationDTO';
import AnimalDonation from '../typeorm/entities/AnimalDonation';

export default interface IAnimalDonationRepository {
  findById(id: string): Promise<AnimalDonation | undefined>;
  findByUserId(id: string): Promise<AnimalDonation[]>;
  find(
    data: IFindAnimalDonationsDTO,
  ): Promise<IFindAnimalDonationsRespDTO<AnimalDonation[]>>;
  create(data: ICreateAnimalDonationDTO): Promise<AnimalDonation>;
  update(data: AnimalDonation): Promise<AnimalDonation>;
  delete(donationId: string): Promise<void>;
}
