import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema= new mongoose.Schema({
    name: String,
    password:{ type:String, required:true},
    email: { type:String, required:true, unique:true},
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    order:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Order',
        },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

userSchema.pre('save', async function (next) {
    const user = this;

    if (!user.isModified('password')) return next();

    try {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  });


const User=mongoose.model('User', userSchema);
export default User