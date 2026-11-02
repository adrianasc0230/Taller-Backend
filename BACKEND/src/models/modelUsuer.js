import { Schema, model } from "mongoose";

const schemaUser = new Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        match: [/^[a-zA-ZÀ-ÿ\s]+$/, "Invalid name"]
    }, 

    email:{
        type: String,
        required: true,
        trim: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}$/, "Invalid email "]
    },

    rol:{
        type: String,
        enum: ["user", "admin"],
        default: 'user',
        required: false,
        trim: true,
        set: v => v ? v.toLowerCase() : "user"
    },

    password:{
        type: String,
        required: true,
        trim: true,
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,15}/, 'Invalid password ']
    },

    idCard:{
        type: String,
        required: true,
        trim: true
    },

    telefono:{
        type: String,
        required: true,
        trim: true,
        match: [/^\+?[1-9]\d{6,14}$/, 'Por favor imgrese un numero de telefono valido']
        
    },

    image: {
        type: String,
        default: 'images/users/logindefault.png'
    }
});

export default model ('User', schemaUser);
