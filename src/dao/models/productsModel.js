import mongoose, {Schema, model} from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

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

productosSchema.plugin(mongoosePaginate);

export const productsModel = mongoose.model(
    productosColl,
    productosSchema
)