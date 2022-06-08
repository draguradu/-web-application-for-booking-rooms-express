import { Router } from "express";
import UserController from "../controllers/UserController";

const router = Router();

//Get all users
router.get("/", UserController.getAll);

// Get one user
router.get("/:id([0-9]+)", UserController.getById);

//Create a new user
router.post("/", UserController.addUser);

//Edit one user
router.put("/:id([0-9]+)", UserController.editUser);

//Delete one user
router.delete("/:id([0-9]+)", UserController.deleteUser);

//Get all Roles
router.get("/roles", UserController.getRoles);

export default router;
