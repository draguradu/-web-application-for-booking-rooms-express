import { Router } from "express";
import SubjectsController from "../controllers/SubjectsController"

const router=Router();

router.patch("/subjects-by-specialization", SubjectsController.getAllBySpecialization);

router.patch("/types", SubjectsController.getAllTypes);

router.get("/", SubjectsController.getAllSubjects);

router.put("/:id([0-9]+)", SubjectsController.editSubject);

router.post("/", SubjectsController.addSubject);

router.delete("/:id([0-9]+)", SubjectsController.deleteSubject);

export default router;