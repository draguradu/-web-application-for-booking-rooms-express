import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import config from "../config";
import { Users, Roles, Specializations } from "../entity";

class AuthController {

    static login = async (req: Request, res: Response) => {
        const { username, password } = req.body;
        if (!(username && password)) {
            res.status(400).send("Credentials not found");
        }

        const userRepository = getRepository(Users);
        let user: Users;
        try {
            user = await userRepository.findOne({
                relations:["specialization","role"],
                where: { username } 
            });
        } catch (error) {
            res.status(404).send("Users not found");
        }

        //Check if encrypted password match
        if (!user.checkIfUnencryptedPasswordIsValid(password)) {
            res.status(401).send("Invalid password");
            return;
        }

        //Sing JWT, valid for 1 hour
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            config.jwtSecret,
            { expiresIn: "1h" }
        );

        res.status(200).send({token, user});
    };

    static changePassword = async (req: Request, res: Response) => {
        const id = res.locals.jwtPayload.userId;
        const { oldPassword, newPassword } = req.body;
            if (!(oldPassword && newPassword)) {
            res.status(400).send("Password not found");
        }

        const userRepository = getRepository(Users);
        let user: Users;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (id) {
            res.status(404).send("Users not found");
        }

        //Check if old password matchs
        if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
            res.status(401).send("Invalid password");
            return;
        }

        //Validate de model (password lenght)
        user.password = newPassword;
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        //Hash the new password and save
        user.hashPassword();
        userRepository.save(user);

        res.status(200).send("Password changed");
    };

    static signup = async (req: Request, res: Response) => {
        const { name, username, password,  yearOfStudy, specialization, role } = req.body;
        const user = new Users();
        user.name = name;
        user.username = username;
        user.password = password;
        user.yearsOfStudy = yearOfStudy;
        
        
        const specializationRepository = getRepository(Specializations);
        const specializ = await specializationRepository.findOne(specialization);
        user.specialization = specializ;

        const roleRepository = getRepository(Roles);
        const rol = await roleRepository.findOne(role);
        user.role = rol;

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

}

export default AuthController;
