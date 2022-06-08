import {MigrationInterface, QueryRunner, getRepository} from "typeorm";
import { Users, Roles, Specializations } from "../entity";

export class CreateUserAdmin1595423303576 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const user = new Users();
        user.name = "Admin";
        user.username = "admin";
        user.password = "admin";
        user.hashPassword();
        user.yearsOfStudy=0;
        user.specialization=null;

        const roleRepository = getRepository(Roles);
        const role = await roleRepository.findOne({name:'admin'});
        user.role = role;

        const userRepository = getRepository(Users);
        await userRepository.save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
