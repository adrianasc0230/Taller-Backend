import { uploadSingleImage } from "../middleware/uploadImage.js";
import modelProduct from "../models/modelProduct.js";
import { subirImagen, borrarImagen } from "../ayudas/cloudinary.js";

import {generarToken, validarToken} from "../ayudas/funciones.js";

const controllerProduct = {
    productCreate: async (req, res) => {
    uploadSingleImage(req, res, async (error) => {
        try {
            if (error) {
                return res.status(400).json({
                    message: 'Ocurrio un error cargando la imagen.',
                    data: error.message,
                });
            }
            if (!req.file) {
                return res.status(400).json({
                    message: 'La imagen es obligatoria',
                    data: null,
                });
            }

            const resultado = await subirImagen(req.file.buffer);

            const newProduct = new modelProduct({
                product: req.body.product,
                category: req.body.category,
                description: req.body.description,
                price: req.body.price,
                rating: req.body.rating,
                numberOfReviews: req.body.numberOfReviews,
                images: resultado.secure_url,
                stock: req.body.stock
            });

            const saveProduct = await newProduct.save();
            res.json({ message: 'Producto guardado', data: saveProduct });
        } catch (err) {
            console.error(err.message);
            res.status(400).json({
                message: 'Error al guardar el producto',
                data: err.message,
            });
        }
    });
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

productUpdate: async (req, res) => {
    try {
        const { id } = req.params;

        const existingProduct = await modelProduct.findById(id);
        if (!existingProduct) {
            return res.status(404).json({
                message: 'Producto no encontrado',
                data: null,
            });
        }

        let nuevaImagen = existingProduct.images;
        if (req.file) {
            const resultado = await subirImagen(req.file.buffer);
            await borrarImagen(existingProduct.images);
            nuevaImagen = resultado.secure_url;
        }

        const newData = {
            product: req.body.product,
            category: req.body.category,
            description: req.body.description,
            price: req.body.price,
            rating: req.body.rating,
            numberOfReviews: req.body.numberOfReviews,
            images: nuevaImagen,
            stock: req.body.stock
        };

        const updatedProduct = await modelProduct.findByIdAndUpdate(
            id,
            newData,
            { new: true, runValidators: true }
        );

        return res.json({
            message: 'Producto actualizado exitosamente.',
            data: updatedProduct,
        });

    } catch (error) {
        console.error(error.message);
        res.status(400).json({
            message: 'Ocurrio un error al actualizar el producto.',
            data: error.message || error,
        });
    }
},
productDelete: async (req, res) => {
    try {
        const productDelete = await modelProduct.findByIdAndDelete(req.params.id);

        if (!productDelete) {
            return res.status(404).json({
                message: 'Producto no encontrado',
                data: null,
            });
        }

        await borrarImagen(productDelete.images);

        res.json({
            message: 'Producto eliminado exitosamente',
            data: productDelete,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: 'Error al eliminar el producto',
            data: error.message,
        });
    }
}
}


export default controllerProduct;