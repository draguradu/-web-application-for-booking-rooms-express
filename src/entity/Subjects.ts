import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import MainEntity from "./MainEntity";
import Professors from "./Professors";
import Specializations from "./Specializations";
import Exams from "./Exams";
import Departments from "./Departments";

@Entity()
class Subjects extends MainEntity{
    
    @Column()
    name: string;
    
    @Column("int")
    study_year:number;

    @Column("int")
    semester:number;

    @OneToMany( type => Exams, exam => exam.subject)
    exams : Exams[];

    @ManyToOne( type => Departments , department => department.id)
    department : Departments;

    @ManyToOne( type => Specializations , specialization => specialization.id)
    specialization : Specializations;
    
}

export default Subjects;