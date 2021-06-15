import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum TokenType {
  REFRESHTOKEN = 'refreshToken',
  RESETTOKEN = 'resetToken',
}

@Entity('UserToken')
class UserToken {
  @PrimaryGeneratedColumn('uuid', { name: 'Id' })
  id: string;

  @Column({ name: 'DeviceId' })
  deviceId: string;

  @Column({ name: 'UserId' })
  userId: string;

  @Column({ name: 'Token' })
  token: string;

  @Column({
    name: 'TokenType',
    type: 'enum',
    enum: TokenType,
    default: TokenType.REFRESHTOKEN,
  })
  tokenType: TokenType;

  @Column({ name: 'ExpiresIn' })
  expiresIn: Date;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt: Date;
}

export default UserToken;
