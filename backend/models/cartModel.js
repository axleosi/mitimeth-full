import mongoose from "mongoose";

const cartSchema= new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId, ref: 'User', required:true},
    productId:{type:mongoose.Schema.Types.ObjectId, ref: 'Product', required:true},
    quantity:{type:Number, default:1},
    imageUrl:{type:String, required:true},
    productName: { type: String },
    productDescription: { type: String },
    productPrice: { type: Number }

}, {timestamps: true})

const Cart=mongoose.model('Cart', cartSchema);
export default Cart