import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateTableUser1593112040135
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'User',
        columns: [
          {
            name: 'Id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'Name',
            type: 'varchar',
          },
          {
            name: 'Email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'EmailConfirmed',
            type: 'boolean',
            default: false,
          },
          {
            name: 'Password',
            type: 'varchar',
          },
          {
            name: 'Avatar',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'UF',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'City',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'IsONG',
            type: 'boolean',
            default: false,
          },
          {
            name: 'PhoneNumber',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'PhoneNumberConfirmed',
            type: 'boolean',
            default: false,
          },
          {
            name: 'CreatedAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'UpdatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('User');
  }
}
