import modelShopping from "../models/modelShopping.js";

const controllerShopping = {
    createShopping: async (req, res) =>{
        try {
            const { email, paymentMethod, addres, totalShopping } = req.body;
            const newShopping = new modelShopping({
                email, 
                paymentMethod, 
                addres, 
                totalShopping
            });

            const createShopping = await newShopping.save();
            if (createShopping._id) {
                res.json({
                    message: `Compra creada exitosamente por un valor de: ${createShopping.totalShopping} su metodo de pago es: ${createShopping.paymentMethod}`,
                    data: createShopping._id,
                });
            }

        } catch (error) {
            res.json({
                message: 'Ocurrio un error creando la compra.',
                data: error,
            });
        }
    },


}

export default controllerShopping;