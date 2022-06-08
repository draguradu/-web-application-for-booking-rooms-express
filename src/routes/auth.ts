import { Router } from "express";
import AuthController from "../controllers/AuthController";

const router = Router();

//Login
router.post("/login", AuthController.login);

//Change my password
router.post("/change-password", AuthController.changePassword);

//Sign up
router.post("/signup", AuthController.signup);

export default router;
