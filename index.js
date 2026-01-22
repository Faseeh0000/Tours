// const express = require ('express');
import express from 'express';
import router from './routes/Tourroutes.js'
import route from './routes/UserRoutes.js';
const app = express();
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
//import mongoSanitize from 'express-mongo-sanitize';
//import xss from 'xss-clean';

// CORS configuration - must be before other middleware
// Allow all origins for Swagger UI compatibility
// app.use(cors({
//   origin: true, // Allow all origins (for Swagger UI)
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
// }));

const limiter = rateLimit({
    max:100,
    windowMs:60*60*1000,
    message:"too many req please try again"
})

// Configure Helmet to work with CORS
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));
app.use(morgan('tiny'));
app.use(express.json());
//app.use(mongoSanitize());
app.use(cookieParser());
 app.get('/',(req,res)=>{
    res.status(200).send("Hello from server side "); 
    console.log( req.requestTime);
})

app.use((req,res,next)=>{
     console.log("its our own middleware which runs everytime when a req called");
     next();
})

// // Handle preflight requests
// app.options('*', cors());

app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString(); 
    
    next();
})

app.use('/', router);
app.use('/',route);
export default app;
