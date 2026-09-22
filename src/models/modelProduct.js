import { Schema, model } from "mongoose";

const schemaProduct = new Schema({
    product:{
        type: String,
        required: true,
        trim: true,
        match: [/^[a-zA-ZÀ-ÿ\s]+$/, "producto invalido"]
    }, 

    category:{
        type: String,
        required: true,
        trim: true
    },

    description:{
        type: String,
        required: false,
        trim: true,
        
    },

    price:{
        type: Number,
        required: true,
        trim: true,
    },

    rating:{
        type: Number,
        required: false,
        trim: true
    },

    numberOfReviews:{
        type: Number,
        required: false,
        trim: true
    },

    images:{
        type: String,
        required: true,
    },

    stock:{
        type: Number,
        required: true,
        trim: true
    },

    token:{
        type: String
    }
});

export default model ('Product', schemaProduct);