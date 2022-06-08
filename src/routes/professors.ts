import { Router } from "express";
import ProfessorsController from "../controllers/ProfessorsController"

const router=Router();

router.get("/", ProfessorsController.getAllProfessors);

router.patch("/professors-by-subject", ProfessorsController.getAllProfessorsBySubject);

router.put("/:id([0-9]+)", ProfessorsController.editProfessor);

router.post("/", ProfessorsController.addProfessor);

router.delete("/:id([0-9]+)", ProfessorsController.deleteProfessor);

export default router