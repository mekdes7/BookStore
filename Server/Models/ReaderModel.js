import mongoose from "mongoose";

const readerSchema = mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,

        },

        lastname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, // Optional: prevents duplicate emails
            lowercase: true,
            trim: true
        },
        password:{
            type: String,
            required:true,
        },
        
        bookcategories: {
            type: String,
            enum: ['Self-help', 'Business', 'Kids', 'Fiction', 'History'], // Add your categories here
            required: true
        }
        
    },
    {
        timestamps:true,
    }

);

export const Reader = mongoose.model('Reader', readerSchema );  
