import {Router} from "express";
import controllerLogin from "../controller/controllerLogin.js";

const routerLogin = Router();
routerLogin.post('/', controllerLogin.login);
routerLogin.get('/token/:token', controllerLogin.validateToken);

export default routerLogin;