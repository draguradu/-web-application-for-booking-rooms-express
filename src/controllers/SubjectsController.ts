import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Subjects, Types, Specializations, Departments } from "../entity";
import { validate } from "class-validator";

class SubjectsController{

    static getAllSubjects = async (req:Request, res:Response) =>{
        const subjectRepository = getRepository(Subjects);
        const subjects = await subjectRepository.find({select:["id","name","study_year","semester","specialization","department"], relations:["specialization", "department"]});
        res.status(200).send({subjects});
    };

    static getAllBySpecialization = async (req: Request, res: Response) => {
        const { spec, year,sem } = req.body;
        const subjectRepository = getRepository(Subjects);
        const subjects = await subjectRepository.find({where:{specialization:spec , semester:sem, study_year:year}});
        res.status(200).send({subjects});
    };

    static getAllTypes = async (req:Request, res:Response) =>{
        const typeRepository=getRepository(Types);
        const types=await typeRepository.find({select:["id", "name"]});
        res.status(200).send({types});
    };

    static addSubject = async (req: Request, res: Response) => {
        const { name, studyYear, semester, specialization, department } = req.body;
        const specializationRepository = getRepository(Specializations);
        const departmenRepository = getRepository(Departments);
        const subject = new Subjects();
        subject.name = name;
        subject.study_year = studyYear;
        subject.semester = semester;
        const specializ = await specializationRepository.findOne(specialization);
        subject.specialization=specializ;
        const depart = await departmenRepository.findOne(department);
        subject.department=depart;

        //Validade if the parameters are ok
        const errors = await validate(subject);
        console.log(errors);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        const subjectRepository = getRepository(Subjects);
        try {
            await subjectRepository.save(subject);
        } catch (error) {
            res.status(409).send("Subject already in use");
            return;
        }

        res.status(200).send("Subject created");
    };

    static editSubject = async (req: Request, res: Response) => {
        const id = req.params.id;
        const { name, studyYear, semester, specialization, department} = req.body;
        const subjectRepository = getRepository(Subjects);
        let subject: Subjects;
        try {
            subject = await subjectRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send("User not found");
            return;
        }

        //Validate the new values on modelconst 
        const specializationRepository = getRepository(Specializations);
        const departmenRepository = getRepository(Departments);
        subject.name = name;
        subject.study_year = studyYear;
        subject.semester = semester;
        const specializ = await specializationRepository.findOne(specialization);
        subject.specialization=specializ;
        const depart = await departmenRepository.findOne(department);
        subject.department=depart;
        const errors = await validate(subject);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        try {
            await subjectRepository.save(subject);
        } catch (error) {
            res.status(409).send("Subject already in use");
            return;
        }
        
        res.status(200).send("Subject edited");
    };

    static deleteSubject = async (req: Request, res: Response) => {
        const id = req.params.id;
        const subjectRepository = getRepository(Subjects);
        let subject: Subjects;
        try {
            subject = await subjectRepository.findOneOrFail(id);
            subjectRepository.delete(id);
        } catch (error) {
            console.log(error);
            res.status(404).send("Subject not found");
            return;
        }

        res.status(200).send("Subject deleted");
    };

}

export default SubjectsController