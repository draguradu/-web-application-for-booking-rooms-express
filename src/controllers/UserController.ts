import { Request, Response } from "express";
import { getRepository, Not } from "typeorm";
import { validate } from "class-validator";
import { Users, Roles, Specializations } from "../entity";

class UserController {

    static getAll = async (req: Request, res: Response) => {
        const userRepository = getRepository(Users);
        const users = await userRepository.find({
            select: ["id", "name", "username","password", "yearsOfStudy", "specialization", "role"],
            relations:["specialization", "role"],
            where:{name:Not('Admin')}
        });

        res.status(200).send({users});
    };

    static getById = async (req: Request, res: Response) => {
        const id: number = Number(req.params.id);

        const userRepository = getRepository(Users);
        try {
            const user = await userRepository.findOneOrFail(id, {
                select: ["id", "name", "username", "yearsOfStudy", "specialization"]
            });
            res.status(200).send(user);
        } catch (error) {
            res.status(404).send("User not found");
        }
    };

    static addUser = async (req: Request, res: Response) => {
        const { name, username, password, role, specialization, yearsOfStudy } = req.body;
        const user = new Users();
        user.name=name;
        user.username = username;
        user.password = password;
        user.yearsOfStudy=yearsOfStudy;
        const roleRepository = getRepository(Roles);
        const rol= await roleRepository.findOne(role);
        user.role = rol;
        const specializationRepository = getRepository(Specializations);
        const specializ = await specializationRepository.findOne(specialization);
        user.specialization=specializ;

        //Validade if the parameters are ok
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        //Hash the password, to securely store on DB
        user.hashPassword();

        const userRepository = getRepository(Users);
        try {
            await userRepository.save(user);
        } catch (error) {
            res.status(409).send("username already in use");
            return;
        }

        res.status(200).send("User created");
    };

    static editUser = async (req: Request, res: Response) => {
        const id = req.params.id;
        const { name, username, role, specialization, yearsOfStudy, password } = req.body;

        const userRepository = getRepository(Users);
        let user: Users;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send("User not found");
            return;
        }

        //Validate the new values on model
        user.name=name;
        user.username = username;
        user.password=password;
        user.yearsOfStudy=yearsOfStudy;
        const roleRepository = getRepository(Roles);
        const rol= await roleRepository.findOne(role);
        user.role = rol;
        const specializationRepository = getRepository(Specializations);
        const specializ = await specializationRepository.findOne(specialization);
        user.specialization=specializ;
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        try {
            await userRepository.save(user);
        } catch (error) {
            res.status(409).send("username already in use");
            return;
        }
        
        res.status(200).send("User edited");
    };

    static deleteUser = async (req: Request, res: Response) => {
        const id = req.params.id;

        const userRepository = getRepository(Users);
        let user: Users;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send("User not found");
            return;
        }
        userRepository.delete(id);

        res.status(200).send("User deleted");
    };

    static getRoles =async (req:Request, res:Response) => {
        const roleRepository= getRepository(Roles);
        const roles = await roleRepository.find({name: Not("admin")});

        res.status(200).send({roles});
    };

};

export default UserController;
