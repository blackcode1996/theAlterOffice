import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import connectDB from './config/database';
import authRoutes from './routes/authRoutes';
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commetRoutes";

import { globalErrorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app: Application = express();

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

connectDB()

const PORT = process.env.PORT || 8080;

app.get("/",(_req,res)=>{
    res.send(`Welcome to Backend`)
})


app.use("/api/auth",authRoutes);
app.use("/api/post",postRoutes);
app.use("/api/post",commentRoutes);
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
