import {Router} from "express";
import ExamsController from '../controllers/ExamsController';

const router=Router();

router.post("/",ExamsController.createExam);

router.get("/examinfo",ExamsController.getExamInfo);

router.patch("/checkAppointment", ExamsController.checkAppointment);

export default router;