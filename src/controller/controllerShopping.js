import modelShopping from "../models/modelShopping.js";
import controllerProduct from "../controller/controllerProduct.js"
import modelProduct from "../models/modelProduct.js";
import {generarToken, validarToken} from "../ayudas/funciones.js";

const controllerShopping = {
    createShopping: async (req, res) =>{
        try {
            const { email, paymentMethod, addres, status, products, token} = req.body;
            const decodificado = await validarToken(token);
            if(decodificado.rol != 'user')
            {
                res.json({
                                message:`Rol no valido para operación`,
                                data: null,
                
                            });
            }

var totalShoppingAux = 0;
            for(let i=0; i< products.length;i++){
                 
                
                try {
                            const productFoundById = await modelProduct.findById(products[i]);
                            if(productFoundById.stock >0){
                                console.log(productFoundById);
                                totalShoppingAux = productFoundById.price + totalShoppingAux;
                            }else{
                                res.json({
                                message:`No hay stock de: ${productFoundById.product}`,
                                data: null,
                
                            });
                            }
                        } catch (error) {
                            res.json({
                                message:`Ocurrió un error con un producto de la compra, ID: ${products[i]}`,
                                data: null,
                
                            });
                             
                        }

            }
            console.log(totalShoppingAux);
            const newShopping = new modelShopping({
                email, 
                paymentMethod, 
                addres, 
                totalShopping: totalShoppingAux,
                status,
                products
            });
            console.log(newShopping);
            const createShopping = await newShopping.save();


            if (createShopping._id) {
                
                res.json({
                    message: `Compra creada exitosamente por un valor de: ${createShopping.totalShopping} su metodo de pago es: ${createShopping.paymentMethod}`,
                    data: createShopping._id,
                });
            }

        } catch (error) {
            console.log(error);
            res.json({
                message: 'Ocurrio un error creando la compra.',
                data: error,
            });
        }
    },
    readShopping : async(req,res)=>{
        try {
            const allShoppingFound = await modelShopping.find();
            
            res.json({
                message: 'Compras encontradas',
                data: allShoppingFound,
            })
        } catch (error) {
            res.json({
                message:'Ocurrió un error encontrando las compras',
                data: error,
            });
        }
    },

    readShoppingID: async(req,res)=>{
        try {
            const shoppingFound = await modelShopping.findById(req.params.id);
            if(shoppingFound._id){
                res.json({
                    message: 'Compra encontrada',
                    data: shoppingFound,
                });
            } 
        } catch (error) {
            res.json({
                message: 'Ocurrió un error encontrando la compra',
                data: error,
            });
        }
    },
    updateShopping: async(req,res)=>{
        try {
            const {status, token}=req.body;
            const decodificado = await validarToken(token);
            if(decodificado.rol != 'admin')
            {
                res.json({
                                message:`Rol no valido para operación`,
                                data: null,
                
                            });
            }
            const shoppingUpdated = await modelShopping.findByIdAndUpdate(req.params.id,
                {status},
                {new: true, runValidators:true}
            );
            if(!shoppingUpdated){
                return res.json({
                    message:'Compra no encontrada',
                    data: null,
                });
            }
            return res.json({
                message:'Estado de la compra actualizado exitosamente',
                data: shoppingUpdated,
            });
        } catch (error) {
            console.log(error);
            res.json({
                message:'Ocurrió un error actualizando el estado de la compra',
                data:error,
            });
        }
    }


}

export default controllerShopping;