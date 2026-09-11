import { Router } from "express";
import controllerUsers from "../controller/controllerUser.js";

const routesUser = Router();

routesUser.post('/', controllerUsers.createUser);
routesUser.get('/',controllerUsers.readUsers);

export default routesUser;