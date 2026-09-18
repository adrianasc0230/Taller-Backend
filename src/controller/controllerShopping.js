import modelShopping from "../models/modelShopping.js";

const controllerShopping = {
    createShopping: async (req, res) =>{
        try {
            const { email, paymentMethod, addres, totalShopping, status} = req.body;
            const newShopping = new modelShopping({
                email, 
                paymentMethod, 
                addres, 
                totalShopping,
                status
            });
console.log(newShopping);
            const createShopping = await newShopping.save();
            if (controllerShopping._id) {
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
            const {status}=req.body;
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