import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Departments } from "../entity";
import { validate } from "class-validator";

class DepartmentsController {
    
    static getAllDepartments = async (req:Request, res:Response)=>{
        const departmentRepository= getRepository(Departments);
        const departments = await departmentRepository.find({select:["id","name"]});
        res.status(200).send({departments});
    };

    static addDepartment = async (req: Request, res: Response) => {
        const { name } = req.body;
        const department = new Departments();
        department.name = name;

        //Validade if the parameters are ok
        const errors = await validate(department);
        console.log(errors);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        const departmentRepository = getRepository(Departments);
        try {
            await departmentRepository.save(department);
        } catch (error) {
            res.status(409).send("Department already in use");
            return;
        }

        res.status(200).send("Department created");
    };

    static editDepartment = async (req: Request, res: Response) => {
        const id = req.params.id;
        const { name } = req.body;
        const departmentRepository = getRepository(Departments);
        let department: Departments;
        try {
            department = await departmentRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send("Department not found");
            return;
        }

        //Validate the new values on modelconst 
        department.name = name;
        const errors = await validate(department);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        try {
            await departmentRepository.save(department);
        } catch (error) {
            res.status(409).send("Subject already in use");
            return;
        }
        
        res.status(200).send("Subject edited");
    };

    static deleteDepartment = async (req: Request, res: Response) => {
        const id = req.params.id;
        const departmentRepository = getRepository(Departments);
        let department: Departments;
        try {
            department = await departmentRepository.findOneOrFail(id);
            departmentRepository.delete(id);
        } catch (error) {
            console.log(error);
            res.status(404).send("Subject not found");
            return;
        }
    };
}

export default DepartmentsController;