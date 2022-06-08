import { Entity, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import MainEntity from "./MainEntity";
import Appointments from "./Appointments";
import Subjects from "./Subjects";
import Types from "./Types";
import Professors from "./Professors";

@Entity()
class Exams extends MainEntity{
    
    @ManyToOne( type => Appointments , appointment => appointment.id)
    appointment : Appointments;

    @ManyToOne( type => Subjects , subject => subject.id)
    subject : Subjects;

    @ManyToOne(type => Types , typ=>typ.id)
    typ:Types;

    @OneToOne( type => Professors)
    @JoinColumn()
    professor:Professors;

}

export default Exams;