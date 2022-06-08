import { Entity, Column, OneToMany } from "typeorm";
import MainEntity from "./MainEntity";
import Users from "./Users";

@Entity()
class Roles extends MainEntity{
 
    @Column()
    name:string;

    @OneToMany( type => Users, users => users.role)
    users : Users[];

}

export default Roles;