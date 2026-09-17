import { Router } from "express";
import controllerProduct from "../controller/controllerProduct.js";
import { uploadSingleImage } from "../middleware/uploadImage.js";

const routerProduct = Router ();
routerProduct.post('/', controllerProduct.productCreate);
routerProduct.get('/:id', controllerProduct.readProductById);
routerProduct.get('/',controllerProduct.readProducts);
routerProduct.put('/:id', uploadSingleImage, controllerProduct.productUpdate);

export default routerProduct;