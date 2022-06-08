import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Subjects, Professors, Departments  } from "../entity";
import { validate } from "class-validator";

class ProfessorsController{

    static getAllProfessors = async (req:Request, res:Response)=>{
        const professorRepository= getRepository(Professors);
        const professors = await professorRepository.find({select:["id","name","department"], relations:["department"]});
        res.status(200).send({professors});
    };

    static getAllProfessorsBySubject=async (req:Request, res:Response ) =>{
        const {subj}=req.body;
        const subjectRepository = getRepository(Subjects);
        const professorRepository = getRepository(Professors);
        const subject = await subjectRepository.findOne(subj,{relations:["department"]});
        const professors= await professorRepository.find({where:{department:subject.department}});
        res.status(200).send({professors});
    };    

    static addProfessor = async (req: Request, res: Response) => {
        const { name, department } = req.body;
        const professor = new Professors();
        professor.name = name;
        const departmenRepository = getRepository(Departments);
        const depart = await departmenRepository.findOne(department);
        professor.department=depart;

        //Validade if the parameters are ok
        const errors = await validate(professor);
        console.log(errors);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        const professorRepository = getRepository(Professors);
        try {
            await professorRepository.save(professor);
        } catch (error) {
            res.status(409).send("Professor already in use");
            return;
        }

        res.status(200).send("Professor created");
    };

    static editProfessor = async (req: Request, res: Response) => {
        const id = req.params.id;
        const { name, department } = req.body;
        const professorRepository = getRepository(Professors);
        let professor: Professors;
        try {
            professor = await professorRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send("Professor not found");
            return;
        }

        //Validate the new values on modelconst 
        professor.name = name;
        const departmenRepository = getRepository(Departments);
        const depart = await departmenRepository.findOne(department);
        professor.department=depart;
        
        const errors = await validate(professor);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        try {
            await professorRepository.save(professor);
        } catch (error) {
            res.status(409).send("Professor already in use");
            return;
        }
        
        res.status(200).send("Professor edited");
    };

    static deleteProfessor = async (req: Request, res: Response) => {
        const id = req.params.id;
        const professorRepository = getRepository(Professors);
        let professor: Professors;
        try {
            professor = await professorRepository.findOneOrFail(id);
            professorRepository.delete(id);
        } catch (error) {
            console.log(error);
            res.status(404).send("Professor not found");
            return;
        }
    }

}

export default ProfessorsController;