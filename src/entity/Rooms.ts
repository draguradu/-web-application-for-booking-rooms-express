import { Entity, Column, OneToMany } from "typeorm";
import { Length } from "class-validator";
import MainEntity from "./MainEntity";
import Appointments from "./Appointments";

@Entity()
class Rooms extends MainEntity{
    
    @Column()
    name: string;
    
    @Column()
    begin_hour: string;

    @Column()
    end_hour: string;

    @OneToMany( type => Appointments , appointment => appointment.room)
    appointments: Appointments[];

}

export default Rooms;