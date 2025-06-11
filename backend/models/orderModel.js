import mongoose from "mongoose";

const orderSchema= new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId, ref: 'User', required:true},
    userName:{type:String, required:true},
    items:[{
        product:{type:mongoose.Schema.Types.ObjectId, ref: 'Product', required:true},
        quantity:{type:Number, required:true},
        priceAtOrderTime:Number,
        nameAtOrderTime:String
    }],
    address:{type:String, required:true},
    phoneNumber:{type:String, required:true},
    totalAmount:{type:Number, required:true},
    status:{type:String, enum:['Pending', 'Paid','Shipped','Cancelled'], default:'Pending'},
}, {timestamps: true})

const Order=mongoose.model('Order', orderSchema);
export default Order