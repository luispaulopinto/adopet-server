import { injectable, inject } from 'tsyringe';

import { classToClass } from 'class-transformer';

import AnimalDonation from '@modules/animalDonation/infra/databases/typeorm/entities/AnimalDonation';

import IAnimalDonationRepository from '@modules/animalDonation/infra/databases/contracts/IAnimalDonationRepository';
import Pagination from '@modules/animalDonation/dtos/IPaginationDTO';

interface ISearchRequest {
  limit: number;
  page: number;
  baseUrl: string;
}

@injectable()
class ListAnimalDonationsUseCase {
  constructor(
    @inject('AnimalDonationRepository')
    private animalDonationRepository: IAnimalDonationRepository,
  ) {}

  public async execute({
    limit,
    page,
    baseUrl,
  }: ISearchRequest): Promise<Pagination<AnimalDonation[]>> {
    const limitParam = limit || 10;
    const pageParam = page || 1;
    const results = await this.animalDonationRepository.find({
      limit: limitParam,
      page: pageParam,
    });

    const pagination: Pagination<AnimalDonation[]> = new Pagination(
      limitParam,
      pageParam,
      results.total,
      baseUrl,
    );

    pagination.results = results.data;

    return classToClass(pagination);
  }
}

export default ListAnimalDonationsUseCase;
