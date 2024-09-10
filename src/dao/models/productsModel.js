import mongoose, {Schema, model} from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const productosColl = "productos"
const productosSchema = new mongoose.Schema(
    {
        price : Number,
        description : String,
        title : String,
        code : {
            type: String, unique : true
        },
        stock : Number,
        category : String,
        thumbnail : String,
        status : {
            type : Boolean, default : true
        }
    },
)

productosSchema.plugin(mongoosePaginate);

export const productsModel = mongoose.model(
    productosColl,
    productosSchema
)