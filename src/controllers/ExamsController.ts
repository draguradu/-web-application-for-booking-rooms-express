import { Request, Response } from "express";
import { getRepository, Like } from "typeorm";
import { Appointments, Exams } from "../entity";
import { validate } from "class-validator";

class ExamController{
    static createExam = async ( req:Request,res:Response ) =>{
        const { subject, professor, type, room, dateOfExam, duration } = req.body;
        const appointment= new Appointments();
            appointment.start_date_exam=dateOfExam;
            appointment.duration=duration;
            appointment.room=room; 

        var errors =await validate(appointment);
        if (errors.length > 0){
            res.status(400).send(errors);
        }

        const appointmentRepository=getRepository(Appointments); 
        const savedAppointment = await appointmentRepository.save(appointment);

        const exam= new Exams();
        exam.subject=subject;
        exam.professor=professor;
        exam.typ=type;
        exam.appointment= savedAppointment;

        errors =await validate(exam);
        if (errors.length > 0){
            res.status(400).send(errors);
        }

        const examRepository=getRepository(Exams); 
        await examRepository.save(exam);

        res.status(200).send("Exam created");
    };

    static getExamInfo = async (req:Request, res:Response) => {
        const examRepository=getRepository(Exams);
        const exams = await examRepository.find({relations:["subject","professor","subject.specialization","appointment","appointment.room","typ"]});

        res.status(200).send({exams})
    };

    static checkAppointment = async (req:Request, res:Response) => {
        try {
        const { room, dateOfExam, duration } = req.body;
        const date = dateOfExam.split("T")[0];

        const appointmentRepository=getRepository(Appointments);
        const appointments = await appointmentRepository.find({
            where: {
                start_date_exam : Like(date + '%'),
                room
              }
        });

        const myTime = dateOfExam.split("T")[1];
        const myHours = myTime.split(":")[0];
        const myMinutes = myTime.split(":")[1];
        const myStartTimeExamInMinutes = parseInt(myHours) * 60 + parseInt(myMinutes);
        const myEndTimeExamInMinutes = myStartTimeExamInMinutes + parseInt(duration);

        var ok = true;
        appointments.map(appointment => {
            const time = appointment.start_date_exam.split("T")[1];
            const hours = time.split(":")[0];
            const minutes = time.split(":")[1];
            const startTimeExamInMinutes = parseInt(hours) * 60 + parseInt(minutes);
            const endTimeExamInMinutes = startTimeExamInMinutes + parseInt(appointment.duration);

            if((myStartTimeExamInMinutes < endTimeExamInMinutes &&  myEndTimeExamInMinutes > startTimeExamInMinutes) ||
               (myStartTimeExamInMinutes < startTimeExamInMinutes &&  myEndTimeExamInMinutes > startTimeExamInMinutes) || 
               (myEndTimeExamInMinutes > endTimeExamInMinutes &&  myStartTimeExamInMinutes < endTimeExamInMinutes)|| 
               (myEndTimeExamInMinutes > startTimeExamInMinutes &&  myStartTimeExamInMinutes < endTimeExamInMinutes)) {
                ok = false;
            }
        })

        if(ok) {
            res.status(200).send();
        } else {
            res.status(409).send();
        }
    }
        catch(error) {
            res.status(409).send();
        }
    };    
}

export default ExamController;