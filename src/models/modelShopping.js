import { Schema, model } from "mongoose";

const schemaShopping = new Schema({
    email:{
        type: String,
        required: true,
        trim: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}$/, "Email invalido "]
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
        
    }
   
});

export default model ('Shopping', schemaShopping);