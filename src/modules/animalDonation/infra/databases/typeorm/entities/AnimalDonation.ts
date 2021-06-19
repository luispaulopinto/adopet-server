import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Exclude } from 'class-transformer';

import User from '@modules/users/infra/databases/typeorm/entities/User';
import AnimalImage from './AnimalImage';

@Entity('AnimalDonation')
class AnimalDonation {
  @PrimaryGeneratedColumn('uuid', { name: 'Id' })
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'UserId' })
  user: User;

  @Column({ name: 'UserId' })
  @Exclude()
  userId: string;

  @Column({ name: 'Title' })
  title: string;

  @Column({ name: 'Description' })
  description: string;

  @Column({ name: 'AnimalType' })
  animalType: string;

  @Column({ name: 'AnimalBreed' })
  animalBreed: string;

  @Column({ name: 'Age' })
  age: number;

  @Column({ name: 'WasAdopted' })
  // @Exclude()
  wasAdopted: boolean;

  @Column({ name: 'Likes' })
  @Exclude()
  likes: number;

  @OneToMany(() => AnimalImage, animalImage => animalImage.animalDonation, {
    cascade: true,
  })
  images: AnimalImage[];

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt: Date;
}

export default AnimalDonation;
