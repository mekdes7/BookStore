import mongoose from "mongoose";

const bookSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,

        },

        author: {
            type: String,
            required: true,
        },
        publishYear: {
            type: Number,
            required: true,
        },
        bookCover:{
            type:String,
            required:true,
        }
        // bookFile:{
        //     type:String,
        //     required:true,
        // }
    },
    {
        timestamps:true,
    }

);

export const Books = mongoose.model('Book', bookSchema );  // ✅ Use 'Book'
