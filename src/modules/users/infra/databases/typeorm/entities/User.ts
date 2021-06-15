import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import uploadConfig from '@config/upload';

import { Exclude, Expose } from 'class-transformer';

@Entity('User')
class User {
  @PrimaryGeneratedColumn('uuid', { name: 'Id' })
  id: string;

  @Column({ name: 'Name' })
  name: string;

  @Column({ name: 'Email' })
  email: string;

  @Column({ name: 'EmailConfirmed' })
  @Exclude()
  emailConfirmed: boolean;

  @Column({ name: 'Password' })
  @Exclude()
  password: string;

  @Column({ name: 'Avatar' })
  @Expose({ groups: ['update'] })
  avatar: string;

  @Column({ name: 'PhoneNumber' })
  @Expose({ groups: ['profile'] })
  phoneNumber: string;

  @Column({ name: 'PhoneNumberConfirmed' })
  @Exclude()
  phoneNumberConfirmed: boolean;

  @Column({ name: 'UF' })
  @Expose({ groups: ['profile', 'update'] })
  uf: string;

  @Column({ name: 'City' })
  @Expose({ groups: ['profile', 'update'] })
  city: string;

  @CreateDateColumn({ name: 'CreatedAt' })
  @Expose({ groups: ['create', 'profile'] })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  @Expose({ groups: ['update'] })
  updatedAt: Date;

  @Expose({ name: 'avatarURL' })
  getavatarURL(): string | null {
    if (!this.avatar) return 'http://www.gravatar.com/avatar/?d=mp';

    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.APP_API_URL}/files/${this.avatar}`;
      default:
        return null;
    }
  }
}

export default User;
