import mongoose from "mongoose";

const productosColl = "Productos"
const productosSchema = new mongoose.Schema(
    {
        price : Number,
        description : String,
        title : String,
        code : Number,
        stock : Number,
        category : String,
        thumbnail : String,
        status : Boolean,
    },
)

export const productsModel = mongoose.model(
    productosColl,
    productosSchema
)