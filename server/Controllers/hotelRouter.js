import express from 'express';
import mongoose from 'mongoose';
import Usermodel from '../Models/userModel.js';
import Hotelmodel from '../Models/hotelsModel.js';
import Bookingsmodel from '../Models/bookings.js';
import authenticatelogin from '../Middlewares/authentication.js';
import {bookingvalidation} from '../Middlewares/validations.js';
import { errorMiddleware } from '../Middlewares/validations.js';

const router = express.Router();

router.post("/manuallyAddHotels", async(req, res) => {
    try {
        let {hotelName, bookingPrice} = req.body;
        let fixName = "";
        for(let i = 0; i < hotelName.length; i++) {
            hotelName[i] === " " ? fixName += "_" : fixName += hotelName[i]
        }
        let myHotel = new Hotelmodel({hotelName: fixName, bookingPrice: bookingPrice});
        myHotel.save();

        return res.status(200).json({msg: "Hotel successfully added"});

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({error: "Internal Server Error"})
    }
})

router.get("/search", authenticatelogin, async (req,res) => {
    try {
        let user = await Usermodel.findById(req.payload.id);
        if(!user) return res.status(200).json({error: "User not found"})

        let allHotels = await Hotelmodel.find();
        console.log(allHotels);

        return res.status(200).json({msg: allHotels})
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({error: "Internal Server Error"})
    }
})

router.get("/search/:hId", authenticatelogin, async (req,res) => {
    try {
        let hId = mongoose.Types.ObjectId(req.params.hId);
        let user = await Usermodel.findById(req.payload.id);
        if(!user) return res.status(200).json({error: "User not found"})

        let theHotel = await Hotelmodel.findById(hId);
        if(!theHotel) return res.status(401).json({error: "Hotel not found."})

        return res.status(200).json({msg: theHotel})
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({error: "Internal Server Error"})
    }
})


router.get("/search/name/:hname",authenticatelogin, async (req,res) => {
    try {
        let {hname} = req.params;
        let user = await Usermodel.findById(req.payload.id);
        if(!user) return res.status(200).json({error: "User not found"})
        
        let theHotel = await Hotelmodel.find({hotelName: { $regex: hname, $options: "i" } });
        if(!theHotel) return res.status(401).json({error: "Hotel not found."})

        return res.status(200).json({msg: theHotel})
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({error: "Internal Server Error"})
    }
})



router.post("/addbooking",authenticatelogin, bookingvalidation(),errorMiddleware, async (req,res) => {
    try {
        let user = await Usermodel.findById(req.payload.id);
        if(!user) return res.status(401).json({error: "User not found"})

        let {hotelId, date} = req.body;
        
        let hotelData = await Hotelmodel.findById(mongoose.Types.ObjectId(hotelId));
        if(!hotelData) return res.status(401).json({error: "Hotel not found"})

        return res.status(200).json({msg: ["working just fine", req.body]})
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({error: "Internal Server Error"})
    }
})

router.get("/mybookings",authenticatelogin, async (req,res) => {
    try {
        let user = await Usermodel.findById(req.payload.id);
        if(!user) return res.status(200).json({error: "User not found"})
        return res.status(200).json({msg: "working just fine"})
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({error: "Internal Server Error"})
    }
})







export default router;