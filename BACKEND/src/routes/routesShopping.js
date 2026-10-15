import { Router } from "express";
import controllerShopping from "../controller/controllerShopping.js";

const routShopping = Router();

routShopping.post('/', controllerShopping.createShopping);
routShopping.get('/', controllerShopping.readShopping);
routShopping.get('/:id', controllerShopping.readShoppingID);
routShopping.patch('/:id',controllerShopping.updateShopping);


export default routShopping;