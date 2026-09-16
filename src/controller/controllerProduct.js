import { uploadSingleImage } from "../middleware/uploadImage.js";
import modelProduct from "../models/modelProduct.js";
import fs from "fs";

const controllerProduct = {
    productCreate: async (req , res)=>{
        try {
            uploadSingleImage(req,res, async(error)=>{
                if(error){
                    console.log(error);
                    res.json({
                        message: 'Ocurrio un error cargando la imagen.',
                        data:error,
                    });
                }
                const newProduct = new modelProduct({
                    product: req.body.product, 
                    category: req.body.category,
                    description: req.body.description,
                    price: req.body.price,
                    rating: req.body.rating,
                    numberOfReviews: req.body.numberOfReviews,  
                    images: req.file.filename,
                    stock: req.body.stock
                });
                
                const saveProduct = await newProduct.save();
                    res.json({
                        message:'Producto guardado',
                        data: saveProduct,
                    });
            })
        } catch (error) {
            res.json({
                message:'Ocurrio un error al guardar el producto',
                data: error,
            });
        }
    },
    readProductById : async(req,res)=>{
        try {
            const productFoundById = await modelProduct.findById(req.params.id);
            if(productFoundById._id){
                res.json({
                    message: `El Producto con el ID: ${productFoundById._id} fue encontrado`,
                    data: productFoundById,
                });
            }
        } catch (error) {
            res.json({
                message:`Ocurrió un error encontrando el producto con el ID:${req.params.id}`,
                data: error,

            });
             
        }
    }
}
export default controllerProduct;