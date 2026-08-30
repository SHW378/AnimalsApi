import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAnimalTable1788048000000 implements MigrationInterface {
  name = 'CreateAnimalTable1788048000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ANIMAL" ("id" SERIAL NOT NULL, "nombre" character varying(100) NOT NULL, "especie" character varying(150) NOT NULL, "raza" character varying(100), "edad" integer NOT NULL, "peso" double precision NOT NULL, CONSTRAINT "CHK_ANIMAL_EDAD_NON_NEGATIVE" CHECK ("edad" >= 0), CONSTRAINT "CHK_ANIMAL_PESO_POSITIVE" CHECK ("peso" > 0), CONSTRAINT "PK_ANIMAL_ID" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "ANIMAL"`);
  }
}
