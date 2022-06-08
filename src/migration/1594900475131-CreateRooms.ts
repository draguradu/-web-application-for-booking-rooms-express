import {MigrationInterface, QueryRunner, getRepository} from "typeorm";
import { Rooms } from "../entity";

export class CreateRooms1594900475131 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const roomRepository = getRepository(Rooms);

        var XLSX = require('xlsx')
        var workbook = XLSX.readFile(process.env.INIT_CWD + '//public//files//rooms.xlsx');
        var sheet_name_list = workbook.SheetNames;
        var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        await Promise.all(xlData.map(async (item: Object) => {
            const room= new Rooms();
            const roomName=item['rooms'];
            room.name=roomName;

            const beginHour=item['begin'];
            room.begin_hour=beginHour;

            const endHour=item['end'];
            room.end_hour=endHour;


            await roomRepository.save(room);
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
