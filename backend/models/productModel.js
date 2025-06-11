import mongoose from "mongoose";

const productSchema= new mongoose.Schema({
    name:{type:String, required:true},
    description:String,
    price:{type:Number, required:true, min:0},
    imageUrl:String,
    stock:{type:String, default:0},
}, {timestamps: true})

const Product=mongoose.model('Product', productSchema);
export default Product