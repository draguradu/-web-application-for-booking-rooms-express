import { Entity, Column, Unique, ManyToOne } from "typeorm";
import { Length } from "class-validator";
import * as bcrypt from "bcryptjs";
import MainEntity from "./MainEntity";
import Roles from "./Roles";
import Specializations from "./Specializations";

@Entity()
@Unique(["username"])
class Users extends MainEntity {

    @Column()
    name: string;

    @Column()
    @Length(4, 20)
    username: string;

    @Column()
    @Length(4, 100)
    password: string;

    @Column("int")
    yearsOfStudy: number;

    @ManyToOne( type=>Specializations, specialization => specialization.id)
    specialization : Specializations;

    @ManyToOne( type => Roles, role => role.id)
    role : Roles;

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }

}

export default Users;
