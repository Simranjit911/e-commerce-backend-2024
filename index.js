import express from 'express';
import dotenv from 'dotenv';
import connectDb from './db.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';
import orderRouter from './routes/orderRoutes.js';
import { isAuth } from './middleware/auth.js';
import cloudinary from 'cloudinary';
import cors from 'cors';
import fileUpload from 'express-fileupload';

dotenv.config();

// variables
const app = express();
const port = process.env.PORT || 8000;
const mongoUrl = process.env.MONGO_URL;

// cloudinary
cloudinary.config({
    cloud_name: 'di5nmtbi1',
    api_key: '238376317584896',
    api_secret: '-_mH_lhK1vex4BIf93UXE80T1TE',
    secure: true,
});
// middlewares
app.use(fileUpload({ useTempFiles: true }));
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('hii');
});

//routes
app.use('/product', productRouter);
app.use('/user', userRouter);
app.use('/order', isAuth, orderRouter);

// db connect
connectDb(mongoUrl);
//listening
app.listen(port, () => console.log('Server running on port:', port));
