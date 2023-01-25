import express from 'express';
import userRouter from "./controllers/userRouter.js";
import hotelRouter from "./controllers/hotelRouter.js";

const app = express();
const port = 5000;

import './utilities/dbConnect.js';

app.use(express.json());

// Routers
app.use("/hotelapi/user", userRouter);
app.use("/hotelapi/data", hotelRouter);

app.listen(port, () => {
    console.log(`App started at port ${port}`)
})
