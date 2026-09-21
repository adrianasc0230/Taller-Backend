import { Schema, model } from "mongoose";

const schemaShopping = new Schema({
    email:{
        type: String,
        required: true,
        trim: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}$/, "Email invalido "],
    }, 

    paymentMethod:{
        type: String,
        required: true,
        trim: true,
        enum: {
            values: ['PSE', 'Tarjeta', 'Contraentrega' ],
            message: "Metodo de pago no valido"
        }
        
    },

    addres:{
        type: String,
        required: false,
        trim: true,
        
    },

    totalShopping:{
        type: Number,
        required: true,
        min: [0.01, "El valor debe ser mayor a 0"]
    }, 

    status:{
        type: String,
        required: true,
        trim: true,
        enum: {
            values: ['Aprobada', 'Entregada', 'Rechazada','Cancelada' ],
            message: "Estado de compra no valido",},
        default: 'Aprobada'
        
    },
    products:{
        type: Array,
        required: true,
        trim: true,
        validate: {
            validator: function(value) {
                return Array.isArray(value) && value.length > 0;
            },
            message: "Debe incluir al menos un producto para generar la compra (ID del producto)"
        }
        
    }
   
});

export default model ('Shopping', schemaShopping);