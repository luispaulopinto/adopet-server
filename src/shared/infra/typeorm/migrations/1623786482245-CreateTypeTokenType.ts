import { MigrationInterface, QueryRunner } from 'typeorm';

export default class CreateTypeTokenType1622495970171
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "TokenType" AS ENUM('refreshToken', 'resetToken')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TYPE "TokenType"`);
  }
}
