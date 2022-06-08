import {MigrationInterface, QueryRunner, getRepository} from "typeorm";
import { Departments } from "../entity";

export class CreateDepartaments1594801403526 implements MigrationInterface {
    name = 'CreateDepartaments1594801403526'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const departmentRepository = getRepository(Departments);
        
        var XLSX = require('xlsx');
        var workbook = XLSX.readFile(process.env.INIT_CWD + '//public//files//departamente.csv');
        var sheet_name_list = workbook.SheetNames;
        var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        const departments = [];
        await Promise.all(xlData.map(async (item: Object) => {
            const department = new Departments();
            const itemDepartment = item['name'];
            if(!departments.includes(itemDepartment)) {
                departments.push(itemDepartment);
                department.name = itemDepartment;
                await departmentRepository.save(department);
            }
        }));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
       
    }

}
