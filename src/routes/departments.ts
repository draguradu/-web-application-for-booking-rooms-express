import { Router } from "express";
import DepartmentsController from "../controllers/DepartmentsController"

const router=Router();

router.patch("/", DepartmentsController.getAllDepartments);

router.put("/:id([0-9]+)", DepartmentsController.editDepartment);

router.post("/", DepartmentsController.addDepartment);

router.delete("/:id([0-9]+)", DepartmentsController.deleteDepartment);

export default router;