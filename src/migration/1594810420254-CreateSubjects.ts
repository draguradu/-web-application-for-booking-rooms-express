import {MigrationInterface, QueryRunner, getRepository} from "typeorm";
import { Subjects, Departments, Specializations } from "../entity";

export class CreateSubjects1594810420254 implements MigrationInterface {
    name = 'CreateSubjects1594810420254';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const subjectRepository = getRepository(Subjects);
        const departmentRepository = getRepository(Departments);
        const specializationRepository = getRepository(Specializations);

        var XLSX = require('xlsx')
        var workbook = XLSX.readFile(process.env.INIT_CWD + '//public//files//materii.csv');
        var sheet_name_list = workbook.SheetNames;
        var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        await Promise.all(xlData.map(async (item: Object) => {
            const subject = new Subjects();
            const itemSubject = item['materie'];
            subject.name = itemSubject;

            const yearSubject = item['an'];
            subject.study_year=yearSubject;

            const semesterSubject = item['semestru'];
            subject.semester=semesterSubject;

            const dep=item['departament'];
            const depart=await departmentRepository.findOne({name:dep});
            subject.department=depart;

            const spec=item['specializarea'];
            const specializ=await specializationRepository.findOne({name:spec});
            subject.specialization=specializ;

            await subjectRepository.save(subject);

         }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
