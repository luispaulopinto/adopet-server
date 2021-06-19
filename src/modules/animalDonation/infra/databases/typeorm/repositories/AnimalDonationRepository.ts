import { getRepository, Repository } from 'typeorm';

import ICreateAnimalDonationDTO from '@modules/animalDonation/dtos/ICreateAnimalDonationDTO';

import IAnimalDonationRepository from '../../contracts/IAnimalDonationRepository';

import AnimalDonation from '../entities/AnimalDonation';

class AnimalDonationRepository implements IAnimalDonationRepository {
  private ormRepository: Repository<AnimalDonation>;

  constructor() {
    this.ormRepository = getRepository(AnimalDonation);
  }

  public async findById(id: string): Promise<AnimalDonation | undefined> {
    const animalDonation = await this.ormRepository.findOne({
      where: { id },
      relations: ['images'],
    });

    return animalDonation;
  }

  public async findByUserId(userId: string): Promise<AnimalDonation[]> {
    const animalDonation = await this.ormRepository.find({
      where: { userId },
      relations: ['images'],
    });
    return animalDonation;
  }

  public async create(
    animalDonationDTO: ICreateAnimalDonationDTO,
  ): Promise<AnimalDonation> {
    const animalDonation = this.ormRepository.create(animalDonationDTO);

    await this.ormRepository.save(animalDonation);

    return animalDonation;
  }

  public async update(animalDonation: AnimalDonation): Promise<AnimalDonation> {
    return this.ormRepository.save(animalDonation);
  }

  public async delete(donationId: string): Promise<void> {
    this.ormRepository.delete(donationId);
  }
}

export default AnimalDonationRepository;
