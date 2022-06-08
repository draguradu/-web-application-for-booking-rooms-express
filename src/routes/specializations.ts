import { Router } from "express";
import SpecializationsController from "../controllers/SpecializationsController";

const router=Router();

router.get("/",SpecializationsController.getAll);

router.get("/number-of-years/:id([0-9]+)", SpecializationsController.getNumberOfYears);

router.put("/:id([0-9]+)", SpecializationsController.editSpecialization);

router.post("/", SpecializationsController.addSpecialization);

router.delete("/:id([0-9]+)", SpecializationsController.deleteSpecialization);

export default router;