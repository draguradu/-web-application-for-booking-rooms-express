import {MigrationInterface, QueryRunner, getRepository} from "typeorm";
import { Specializations } from "../entity";

export class CreateSpecializations1594809593433 implements MigrationInterface {
    name = 'CreateSpecializations1594809593433';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const specializationRepository = getRepository(Specializations);
        
        var XLSX = require('xlsx')
        var workbook = XLSX.readFile(process.env.INIT_CWD + '//public//files//specializations.xlsx');
        var sheet_name_list = workbook.SheetNames;
        var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        await Promise.all(xlData.map(async (item: Object) => {
            const specialization = new Specializations();
            const itemSpecialization = item['specialization'];
            specialization.name=itemSpecialization;

            const itemYears=item['numberOfYears'];
            specialization.numberOfYears=itemYears;
            
                await specializationRepository.save(specialization);
            
         }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
