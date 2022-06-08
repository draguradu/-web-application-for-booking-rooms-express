import { Entity, Column,  OneToMany } from "typeorm";
import MainEntity from "./MainEntity";
import  Exams  from "./Exams";

@Entity()
class Types extends MainEntity{
    
    @Column()
    name: string;

    @OneToMany(type => Exams , exam => exam.typ)
    exams:Exams[];

}

export default Types;