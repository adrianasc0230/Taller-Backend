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
    }
});

export default model ('User', schemaUser);
