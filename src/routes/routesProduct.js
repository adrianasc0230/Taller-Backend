import { Router } from "express";
import controllerProduct from "../controller/controllerProduct.js";
import { uploadSingleImage } from "../middleware/uploadImage.js";

const routerProduct = Router ();
routerProduct.post('/', controllerProduct.productCreate);

export default routerProduct;