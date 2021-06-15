import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateTableUserToken1622496822809
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'UserToken',
        columns: [
          {
            name: 'Id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'DeviceId',
            type: 'uuid',
          },
          {
            name: 'UserId',
            type: 'uuid',
          },
          {
            name: 'Token',
            type: 'varchar',
          },
          {
            name: 'TokenType',
            type: `"TokenType"`,
            enum: ['refreshToken', 'resetToken'],
            default: `'refreshToken'`,
          },
          {
            name: 'ExpiresIn',
            type: 'timestamp',
          },
          {
            name: 'CreatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'FK_UserToken_User',
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
    await queryRunner.dropTable('UserToken');
  }
}
