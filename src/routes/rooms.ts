import {Router} from "express";
import RoomsController from '../controllers/RoomsController';

const router=Router();

router.get("/",RoomsController.getAllRooms);

router.put("/:id([0-9]+)", RoomsController.editRoom);

router.post("/", RoomsController.addRoom);

router.delete("/:id([0-9]+)", RoomsController.deleteRoom);

export default router;