import { Router } from "express";
import AppointmentsController from "../controllers/AppointmentsController";

const router = Router();

//Get all users
router.get("/", AppointmentsController.getAllAppointments);

//Create a new user
router.post("/", AppointmentsController.addAppointment);

//Edit one user
router.put("/:id([0-9]+)", AppointmentsController.editAppointment);

//Delete one user
router.delete("/:id([0-9]+)", AppointmentsController.deleteAppointment);

export default router;
