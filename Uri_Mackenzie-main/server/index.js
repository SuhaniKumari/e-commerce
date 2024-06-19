const express = require('express');
const connectToDatabase = require('./configs/database');
const connectToCloudinary = require('./configs/cloudinary')
const cors = require('cors');
const fileUpload = require("express-fileupload");
const cookieParser = require('cookie-parser')
require('dotenv').config();

const app = express();

//  Connections
connectToDatabase(process.env.DATABASE_URL);
connectToCloudinary(process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_API_SECRET);

//  Importing routes
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const shiprocketRoutes = require('./routes/shiprockRoutes');

//  Middlewares
app.use(cors({
    // origin: '*',
    origin: process.env.CORS_URL,
    credentials: true,
}))
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
}))
app.use(express.json());

//  Setting up routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/order', orderRoutes)
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/review', reviewRoutes)
app.use('/api/v2/shprckt', shiprocketRoutes)

app.get('/', (req, res) => {
    return res.status(200).json({ success: true, message: "Server is runnng good 🚀" });
})

app.listen(process.env.PORT, () => { console.log(`Server: http://localhost:${process.env.PORT}`) });