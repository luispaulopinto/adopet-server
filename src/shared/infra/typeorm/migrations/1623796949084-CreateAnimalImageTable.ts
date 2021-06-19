import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateAnimalImageTable1623796949084
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'AnimalImage',
        columns: [
          {
            name: 'Id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'AnimalDonationId',
            type: 'uuid',
          },
          {
            name: 'FileName',
            type: 'varchar',
          },
          {
            name: 'CreatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'FK_AnimalImage_AnimalDonation',
            referencedTableName: 'AnimalDonation',
            referencedColumnNames: ['Id'],
            columnNames: ['AnimalDonationId'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('AnimalImage');
  }
}
