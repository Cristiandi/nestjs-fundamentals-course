import {MigrationInterface, QueryRunner} from "typeorm";

export class CoffeeRefactor1597551309691 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `alter table "coffee" rename column "name" to "title"`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `alter table "coffee" rename column "title" to "name"`
        );
    }

}
