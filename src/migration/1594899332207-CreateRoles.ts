import {MigrationInterface, QueryRunner, getRepository} from "typeorm";
import { Roles } from "../entity";

export class CreateRoles1594899332207 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {     
        const roleRepository= getRepository(Roles);

        var XLSX = require('xlsx')
        var workbook = XLSX.readFile(process.env.INIT_CWD + '//public//files//roluri.xlsx');
        var sheet_name_list = workbook.SheetNames;
        var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        await Promise.all(xlData.map(async (item: Object) => {
            const role=new Roles();
            const rol=item['roles'];
            role.name=rol;

            await roleRepository.save(role);


        }));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
