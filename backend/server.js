import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import router from './routes/users.js';
import orderRouter from './routes/orders.js'
import productRouter from './routes/products.js'
import cartRouter from './routes/cart.js'
import adminRouter from './routes/admin.js'
import cors from 'cors'
dotenv.config()

const app=express();
const PORT=process.env.PORT || 3000;
const MONGO_URI=process.env.MONGO_URI;

app.use(express.json())
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-frontend.vercel.app' 
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true, 
}));
const connectDB= async()=>{
    try {
        mongoose.connection.on('connected', ()=> {console.log('Database connected');}
        )
        await mongoose.connect(`${MONGO_URI}/mitimeth`)
    } catch (error) {
        console.error('connection error:', error);
    }
}

await connectDB()

app.use('/api', router);
app.use('/api', orderRouter)
app.use('/api', productRouter)
app.use('/api', cartRouter)
app.use('/api', adminRouter)


app.get('/', (req,res)=>{
    res.send('Hello world')
})

app.listen(PORT, ()=>{
    console.log(`App is running on port ${PORT}`)
})