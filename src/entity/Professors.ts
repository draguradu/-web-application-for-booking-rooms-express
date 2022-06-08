import { Entity, Column, ManyToOne } from "typeorm";
import MainEntity from "./MainEntity";
import Departments from "./Departments";

@Entity()
class Professors extends MainEntity{
    
    @Column()
    name: string;

    @ManyToOne( type => Departments , department => department.id)
    department : Departments;

}

export default Professors;