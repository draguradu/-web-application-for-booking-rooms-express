import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import MainEntity from "./MainEntity";
import Rooms from "./Rooms";
import Exams from "./Exams";

@Entity()
class Appointments extends MainEntity{
    
    @Column()
    start_date_exam:string;

    @Column()
    duration:string;

    @ManyToOne( type => Rooms, room => room.id)
    room : Rooms;

    @OneToMany( type => Exams, exam => exam.appointment)
    exams : Exams[];

}

export default Appointments;