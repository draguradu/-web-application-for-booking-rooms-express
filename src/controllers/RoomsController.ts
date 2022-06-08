import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Rooms } from "../entity";
import { validate } from "class-validator";

class RoomsController{

    static getAllRooms = async ( req:Request, res:Response )=> {
        const roomRepository= getRepository(Rooms);
        const rooms= await roomRepository.find({select:["id", "name", "begin_hour", "end_hour"]});
        res.status(200).send({rooms})
    };

    static addRoom = async (req: Request, res: Response) => {
        const { name, beginHour, endHour } = req.body;
        const room = new Rooms();
        room.name = name;
        room.begin_hour = beginHour;
        room.end_hour = endHour;

        //Validade if the parameters are ok
        const errors = await validate(room);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        const roomRepository = getRepository(Rooms);
        try {
            await roomRepository.save(room);
        } catch (error) {
            res.status(409).send("Room already in use");
            return;
        }

        res.status(200).send("Room created");
    };


    static editRoom = async (req: Request, res: Response) => {
        const id = req.params.id;
        const { name, beginHour, endHour} = req.body;

        const roomRepository = getRepository(Rooms);
        let room: Rooms;
        try {
            room = await roomRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send("User not found");
            return;
        }

        //Validate the new values on model
        room.name = name;
        room.begin_hour=beginHour;
        room.end_hour=endHour;
        const errors = await validate(room);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        try {
            await roomRepository.save(room);
        } catch (error) {
            res.status(409).send("Room already in use");
            return;
        }
        
        res.status(200).send("Room edited");
    };

    static deleteRoom = async (req: Request, res: Response) => {
        const id = req.params.id;

        const roomRepository = getRepository(Rooms);
        let room: Rooms;
        try {
            room = await roomRepository.findOneOrFail(id);
            roomRepository.delete(id);
        } catch (error) {
            res.status(404).send("Room not found");
            return;
        }

        res.status(200).send("Room deleted");
    };
}

export default RoomsController;