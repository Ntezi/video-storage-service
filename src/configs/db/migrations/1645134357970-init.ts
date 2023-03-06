import {MigrationInterface, QueryRunner} from "typeorm";
import fs from "fs";
import path from "path";

export class init1645134357970 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const sql = fs.readFileSync(path.resolve('src/configs/db/sql/init_video_storage.sql')).toString();
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("");
    }

}
