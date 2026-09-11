import { Router } from "express";
import controllerUsers from "../controller/controllerUser.js";

const routesUser = Router();

routesUser.post('/', controllerUsers.createUser);

export default routesUser;