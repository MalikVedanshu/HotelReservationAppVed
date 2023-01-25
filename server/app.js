import express from 'express';
import userRouter from "./Controllers/userRouter.js";
import hotelRouter from "./Controllers/hotelRouter.js";

const app = express();
const port = 5000;

app.use(express.json());

import './Utilities/dbConnect.js';  // dbConnection 


// Routers
app.use("/hotelapi/user", userRouter); // public routes mainly for login and register
app.use("/hotelapi/data", hotelRouter); // private routes for accessing and availing services

app.listen(port, () => {
    console.log(`App started at port ${port}`)
})
