import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Appointments, Rooms } from "../entity";
import { validate } from "class-validator";

class AppointmentsControler {

    static getAllAppointments = async (req: Request, res: Response) => {
        const appointmentRepository = getRepository(Appointments);
        const appointments = await appointmentRepository.find({
            select: ["id", "start_date_exam", "duration","room"],
            relations:["room"]
        });
        res.status(200).send({appointments});
    };

    static addAppointment = async (req:Request, res:Response) => {
        const {startDateExam, duration, room}=req.body;
        const appointment= new Appointments();
        appointment.start_date_exam=startDateExam;
        appointment.duration=duration;
        const roomRepository=getRepository(Rooms);
        const rom= await roomRepository.findOne(room);
        appointment.room=rom;

        //Validade if the parameters are ok
        const errors = await validate(appointment);
        console.log(errors);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        const appointmentRepository = getRepository(Appointments);
        try {
            await appointmentRepository.save(appointment);
        } catch (error) {
            res.status(409).send("Appointment already in use");
            return;
        }

        res.status(200).send("Appointment created");
    };

    static editAppointment = async (req:Request, res:Response) => {
        const id = req.params.id;
        const {startDateExam, duration, room}=req.body;
        const appointmentRepository = getRepository(Appointments);
        let appointment: Appointments;
        try{
            appointment = await appointmentRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send("Appointment not found")
            return;
        }

        //Validate the new values on modelconst
        appointment.start_date_exam=startDateExam;
        appointment.duration=duration;
        const roomRepository=getRepository(Rooms);
        const rom= await roomRepository.findOne(room);
        appointment.room=rom;

        //Validade if the parameters are ok
        const errors = await validate(appointment);
        console.log(errors);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        try {
            await appointmentRepository.save(appointment);
        } catch (error) {
            res.status(409).send("Appointment already in use");
            return;
        }

        res.status(200).send("Appointment created");
    };

    static deleteAppointment = async (req: Request, res: Response) => {
        const id = req.params.id;
        const appointmentRepository = getRepository(Appointments);
        let appointment: Appointments;
        try {
            appointment = await appointmentRepository.findOneOrFail(id);
            appointmentRepository.delete(id);
        } catch (error) {
            console.log(error);
            res.status(404).send("Appointment not found");
            return;
        }

        res.status(200).send("Appointment deleted");
    };

    
}

export default AppointmentsControler;