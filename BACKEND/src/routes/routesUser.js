import { Router } from "express";
import controllerUsers, {forgotPassword} from "../controller/controllerUser.js";
import { uploadUserImage } from "../middleware/uploadImage.js";

const routesUser = Router();

routesUser.post('/',uploadUserImage, controllerUsers.createUser);
routesUser.get('/',controllerUsers.readUsers);
routesUser.get('/:id', controllerUsers.readUserId);
routesUser.delete('/:id', controllerUsers.deleteUser);
routesUser.put('/:id', uploadUserImage, controllerUsers.updateUser);
routesUser.post('/forgotPassword', forgotPassword);

export default routesUser;