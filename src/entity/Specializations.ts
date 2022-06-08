import { Entity, Column, OneToMany } from "typeorm";
import MainEntity from "./MainEntity";
import Subjects from "./Subjects";
import { type } from "os";
import Users from "./Users";

@Entity()
class Specializations extends MainEntity{
  
    @Column()
    name: string;

    @Column()
    numberOfYears: number;

    @OneToMany( type => Subjects, subject => subject.specialization)
    subject: Subjects[];

    @OneToMany( type => Users, user => user.specialization)
    user: Users[];
}

export default Specializations;