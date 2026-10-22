import { Router } from "express";
import controllerUsers, {forgotPassword} from "../controller/controllerUser.js";

const routesUser = Router();

routesUser.post('/', controllerUsers.createUser);
routesUser.get('/',controllerUsers.readUsers);
routesUser.get('/:id', controllerUsers.readUserId);
routesUser.delete('/:id', controllerUsers.deleteUser);
routesUser.put('/:id', controllerUsers.updateUser);
routesUser.post('/forgotPassword', forgotPassword);

export default routesUser;