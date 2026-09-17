import { uploadSingleImage } from "../middleware/uploadImage.js";
import modelProduct from "../models/modelProduct.js";
import fs from "fs";
import path from "path";

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
    },

    readProducts: async(req,res)=>{
        try {
            const productsFound= await modelProduct.find();
            res.json({
                message: 'Productos encontrados exitosamente',
                data: productsFound,
            });
        } catch (error) {
            res.json({
                message:'No se pudo encontrar los productos',
                data: error,
            });
            
        }
    },

    productUpdate: async ( req, res) => {
        try {
            const { id } = req.params;

            const existingProduct = await modelProduct.findById(id);
            if (!existingProduct) {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }

                return res.json({
                    message: 'Producto no encontrado',
                    data: null,
                });
            }

            if ( req.file){
                if(existingProduct.images) {
                    const oldImagesPath = path.join('images', existingProduct.images);

                    if (fs.existsSync(oldImagesPath)) {
                        fs.unlinkSync(oldImagesPath);
                    }
                }
            }

            const newData = {
                product: req.body.product, 
                category: req.body.category,
                description: req.body.description,
                price: req.body.price,
                rating: req.body.rating,
                numberOfReviews: req.body.numberOfReviews,  
                images: req.file ? req.filename : existingProduct.images,
                stock: req.body.stock
            };

            const updatedProduct = await modelProduct.findByIdAndUpdate(
                id,
                newData,
                { new : true}
            );

            return res.json({
                message: 'Producto actualizado exitosamente.',
                data: updatedProduct,
            });

        } catch (error) {
            res.json({
                message: 'Ocurrio un error al actualizar el producto.',
                data: error.message || error,
            });
        }
    },
    productDelete : async (req, res)=> {
        try {
            const productDelete = await modelProduct.findByIdAndDelete(req.params.id);

            if(!productDelete){
            return res.json({
                    message:'producto no encontrado',
                    data:null,
                });
            }
            if(productDelete.images){
                const oldImages = path.join('imagenes',productDelete.images);
                
                if(fs.existsSync(oldImages)){
                    fs.unlinkSync(oldImages);
                }
            }
            res.json({
                message:'producto eliminado exitosamente',
                data: productDelete._id,
            });
        } catch (error) {
            console.log(error);
            res.json({
                message:'error al eliminar el producto',
                data: error,
            });
        }
    }
}


export default controllerProduct;