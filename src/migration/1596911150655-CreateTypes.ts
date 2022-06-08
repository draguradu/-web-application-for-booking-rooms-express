import {MigrationInterface, QueryRunner, getRepository} from "typeorm";
import Types from "../entity/Types";

export class CreateTypes1596911150655 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const typeRepository=getRepository(Types);

        var XLSX = require('xlsx')
        var workbook = XLSX.readFile(process.env.INIT_CWD + '//public//files//types.xlsx');
        var sheet_name_list = workbook.SheetNames;
        var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        await Promise.all(xlData.map(async (item: Object) => {
            const type=new Types();
            const tip = item['type'];
            type.name=tip;

            await typeRepository.save(type);
         }));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
