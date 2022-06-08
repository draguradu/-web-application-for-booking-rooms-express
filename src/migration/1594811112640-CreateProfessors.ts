import {MigrationInterface, QueryRunner, getRepository} from "typeorm";
import { Professors, Departments } from "../entity";

export class CreateProfessors1594811112640 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const professorRepository = getRepository(Professors);
        const departmentRepository = getRepository(Departments);

        
        var XLSX = require('xlsx')
        var workbook = XLSX.readFile(process.env.INIT_CWD + '//public//files//cadredidactice.csv');
        var sheet_name_list = workbook.SheetNames;
        var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        await Promise.all(xlData.map(async (item: Object) => {
            const professor = new Professors();
            const itemProfessor = item['profesor'];
            professor.name = itemProfessor;

            const name=item['departament'];
            const dep=await departmentRepository.findOne({name});
            professor.department=dep;
            await professorRepository.save(professor);
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
