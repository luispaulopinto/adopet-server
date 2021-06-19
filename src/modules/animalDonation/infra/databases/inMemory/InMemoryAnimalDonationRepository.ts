import { v4 as uuid } from 'uuid';

import ICreateAnimalDonationDTO from '@modules/animalDonation/dtos/ICreateAnimalDonationDTO';

import IFindAnimalDonationsDTO from '@modules/animalDonation/dtos/IFindAnimalDonationsDTO';
import IFindAnimalDonationsRespDTO from '@modules/animalDonation/dtos/IFindAnimalDonationsRespDTO';
import IAnimalDonationRepository from '../contracts/IAnimalDonationRepository';

import AnimalDonation from '../typeorm/entities/AnimalDonation';

class InMemoryAnimalDonationRepository implements IAnimalDonationRepository {
  private animalDonations: AnimalDonation[] = [];

  public async find(
    _data: IFindAnimalDonationsDTO,
  ): Promise<IFindAnimalDonationsRespDTO<AnimalDonation[]>> {
    return { data: this.animalDonations, total: this.animalDonations.length };
  }

  public async findById(id: string): Promise<AnimalDonation | undefined> {
    const findAnimalDonation = this.animalDonations.find(
      animalDonation => animalDonation.id === id,
    );

    return findAnimalDonation;
  }

  public async findByUserId(userId: string): Promise<AnimalDonation[]> {
    const findAnimalDonation = this.animalDonations.filter(
      animalDonation => animalDonation.userId === userId,
    );

    return findAnimalDonation;
  }

  public async create(
    animalDonationData: ICreateAnimalDonationDTO,
  ): Promise<AnimalDonation> {
    const animalDonation = new AnimalDonation();

    Object.assign(animalDonation, { id: uuid() }, animalDonationData);

    this.animalDonations.push(animalDonation);

    return animalDonation;
  }

  public async update(animalDonation: AnimalDonation): Promise<AnimalDonation> {
    const animalDonationIndex = this.animalDonations.findIndex(
      findUser => findUser.id === animalDonation.id,
    );

    this.animalDonations[animalDonationIndex] = animalDonation;

    return animalDonation;
  }

  public async delete(donationId: string): Promise<void> {
    const animalDonationIndex = this.animalDonations.findIndex(
      findUser => findUser.id === donationId,
    );

    this.animalDonations.splice(animalDonationIndex, 1);
  }
}

export default InMemoryAnimalDonationRepository;
