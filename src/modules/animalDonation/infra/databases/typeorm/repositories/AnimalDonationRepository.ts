import { getRepository, Repository } from 'typeorm';

import ICreateAnimalDonationDTO from '@modules/animalDonation/dtos/ICreateAnimalDonationDTO';

import IFindAnimalDonationsDTO from '@modules/animalDonation/dtos/IFindAnimalDonationsDTO';
import IFindAnimalDonationsRespDTO from '@modules/animalDonation/dtos/IFindAnimalDonationsRespDTO';
import IAnimalDonationRepository from '../../contracts/IAnimalDonationRepository';

import AnimalDonation from '../entities/AnimalDonation';

class AnimalDonationRepository implements IAnimalDonationRepository {
  private ormRepository: Repository<AnimalDonation>;

  constructor() {
    this.ormRepository = getRepository(AnimalDonation);
  }

  public async find({
    limit,
    page,
  }: IFindAnimalDonationsDTO): Promise<
    IFindAnimalDonationsRespDTO<AnimalDonation[]>
  > {
    const donations = this.ormRepository
      .createQueryBuilder('d')
      .leftJoinAndSelect('d.images', 'i', 'd.id = i.animalDonationId')
      .leftJoinAndSelect('d.user', 'u', 'd.userId = u.id')
      .orderBy('d.updatedAt', 'DESC')
      .take(limit)
      .skip((page - 1) * limit);

    // NOT IMPLEMENTED
    // if (city) donations.andWhere('feed.City = :City', { City: city });
    // if (state) donations.andWhere('feed.State = :State', { State: state });
    // const test = this.ormRepository.query(
    //   `
    // SELECT "d".*, "images".*
    // FROM "AnimalDonation" "d"
    // LEFT JOIN "AnimalImage" "images"
    //   ON "images"."AnimalDonationId"="d"."Id"
    // ORDER BY "d"."UpdatedAt" DESC
    // LIMIT 4
    // `,
    // );
    const results = await donations.getManyAndCount();

    return { data: results[0], total: results[1] };
  }

  public async findById(
    id: string,
    relations: string[] = ['images'],
  ): Promise<AnimalDonation | undefined> {
    const animalDonation = await this.ormRepository.findOne({
      where: { id },
      relations,
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
