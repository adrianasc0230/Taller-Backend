import { Router } from "express";
import controllerShopping from "../controller/controllerShopping.js";

const routShopping = Router();

routShopping.post('/', controllerShopping.createShopping);

export default routShopping;