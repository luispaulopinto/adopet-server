import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateAnimalDonationTable1623796369410
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'AnimalDonation',
        columns: [
          {
            name: 'Id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'UserId',
            type: 'uuid',
          },
          {
            name: 'Title',
            type: 'varchar',
          },
          {
            name: 'Description',
            type: 'varchar',
          },
          {
            name: 'AnimalType',
            type: 'varchar',
          },
          {
            name: 'AnimalBreed',
            type: 'varchar',
          },
          {
            name: 'Age',
            type: 'numeric',
          },
          {
            name: 'WasAdopted',
            type: 'boolean',
            default: false,
          },
          {
            name: 'Likes',
            type: 'numeric',
            isNullable: true,
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
        foreignKeys: [
          {
            name: 'FK_AnimalDonation_User',
            referencedTableName: 'User',
            referencedColumnNames: ['Id'],
            columnNames: ['UserId'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('AnimalDonation');
  }
}
