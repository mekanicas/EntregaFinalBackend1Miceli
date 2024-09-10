import mongoose, {Schema, model} from "mongoose";

const cartSchema = new Schema ({
    products : {
        default : [],
        type : [
            {
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref : "productos"
                },
                quantity : {
                    type: Number,
                    default: 0
                }
            }
        ]
    }
},
{
    timestamps : true
}
)

export const CartModel = model("carrito", cartSchema);