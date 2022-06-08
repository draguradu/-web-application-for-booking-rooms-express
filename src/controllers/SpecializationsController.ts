import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Specializations } from "../entity";
import { validate } from "class-validator";

class SpecializationsController {

    static getAll = async (req: Request, res: Response) => {
        const specializationRepository = getRepository(Specializations);
        const specializations = await specializationRepository.find({
            select: ["id", "name", "numberOfYears"]
        });
        res.status(200).send({specializations});
    };

    static getNumberOfYears = async (req: Request, res: Response) => {
        const id: number = Number(req.params.id);

        const specializationRepository = getRepository(Specializations);
        try {
            const years = await specializationRepository.findOneOrFail(id, {
                select: ["numberOfYears"]
            });
            res.status(200).send(years);
        } catch (error) {
            res.status(404).send("Id not found");
        }
    };

    static addSpecialization = async (req: Request, res: Response) => {
        const { name, numberOfYears } = req.body;
        const specialization = new Specializations();
        specialization.name = name;
        specialization.numberOfYears = numberOfYears;

        //Validade if the parameters are ok
        const errors = await validate(specialization);
        console.log(errors);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        const specializationRepository = getRepository(Specializations);
        try {
            await specializationRepository.save(specialization);
        } catch (error) {
            res.status(409).send("Specialization already in use");
            return;
        }

        res.status(200).send("Specialization created");
    };

    static editSpecialization = async (req: Request, res: Response) => {
        const id = req.params.id;
        const { name , numberOfYears} = req.body;
        const specializationRepository = getRepository(Specializations);
        let specialization: Specializations;
        try {
            specialization = await specializationRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send("Specialization not found");
            return;
        }

        //Validate the new values on modelconst 
        specialization.name = name;
        specialization.numberOfYears = numberOfYears;
        const errors = await validate(specialization);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        try {
            await specializationRepository.save(specialization);
        } catch (error) {
            res.status(409).send("Subject already in use");
            return;
        }
        
        res.status(200).send("Subject edited");
    };

    static deleteSpecialization = async (req: Request, res: Response) => {
        const id = req.params.id;
        const specializationRepository = getRepository(Specializations);
        let specialization: Specializations;
        try {
            specialization = await specializationRepository.findOneOrFail(id);
            specializationRepository.delete(id);
        } catch (error) {
            console.log(error);
            res.status(404).send("Subject not found");
            return;
        }
    };

}

export default SpecializationsController;       