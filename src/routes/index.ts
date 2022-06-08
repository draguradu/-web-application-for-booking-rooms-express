// exports all the routes

import { Router } from "express";
import auth from "./auth";
import users from "./users";
import specializations from "./specializations";
import subjects from "./subjects";
import rooms from "./rooms";
import exams from "./exams";
import professors from "./professors";
import departments from "./departments";
import appointments from "./appointments";

const routes = Router();

routes.use("/auth", auth);
routes.use("/users", users);
routes.use("/specializations", specializations);
routes.use("/subjects", subjects);
routes.use("/rooms",rooms);
routes.use("/exams",exams);
routes.use("/professors",professors);
routes.use("/departments",departments);
routes.use("/appointments",appointments)

export default routes;
