import { Exclude, Expose } from 'class-transformer';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import uploadConfig from '@config/upload';

import AnimalDonation from './AnimalDonation';

@Entity('AnimalImage')
class AnimalImage {
  @PrimaryGeneratedColumn('uuid', { name: 'Id' })
  id: string;

  @ManyToOne(() => AnimalDonation, animalDonation => animalDonation.images)
  @JoinColumn({ name: 'AnimalDonationId' })
  animalDonation: AnimalDonation;

  @Column({ name: 'AnimalDonationId' })
  @Exclude()
  animalDonationId: string;

  @Column({ name: 'FileName' })
  @Exclude()
  fileName: string;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt: Date;

  @Expose({ name: 'imageURL' })
  getimageURL(): string | null {
    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.APP_API_URL}/files/${this.fileName}`;
      default:
        return null;
    }
  }
}

export default AnimalImage;
