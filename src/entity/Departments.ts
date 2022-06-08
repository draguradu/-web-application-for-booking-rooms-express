import { Entity, Column, OneToMany } from "typeorm";
import MainEntity from "./MainEntity";
import Professors from "./Professors";
import Subjects from "./Subjects";

@Entity()
class Departments extends MainEntity{
   
    @Column()
    name: string;

    @OneToMany( type => Professors, professor => professor.department)
    professors : Professors[];

    @OneToMany( type => Subjects, subject => subject.department)
    subjects : Subjects[];

}

export default Departments;