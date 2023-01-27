import express from 'express';
import mongoose from 'mongoose';
import Usermodel from '../Models/userModel.js';
import Hotelmodel from '../Models/hotelsModel.js';
// import Bookingsmodel from '../Models/bookings.js';
import datesGenerator from '../Utilities/istDateGenerator.js';
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
        let duplicateName = await Hotelmodel.findOne({hotelName: req.body.hotelName})
        if(duplicateName) return res.status(401).json({error: "Hotel name is taken. Choose another name"})

        if(req.body.bookingPrice <= 0) return res.status(401).json({error: "Incorrrect price selected"})

        let myHotel = new Hotelmodel({hotelName: fixName, bookingPrice: bookingPrice});
        await myHotel.save();

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
        if(!hotelData) return res.status(401).json({error: "Hotel not found"});

        let checkin = date[0];
        let checkout = date[1];

        let checkinDate = date[0].split("-");
        let checkoutDate = date[1].split("-");
        

        let checkinInNum = new Date(checkinDate[2], checkinDate[1] -1, checkinDate[0]).getTime()
        let checkoutNum = new Date(checkoutDate[2], checkoutDate[1] -1, checkoutDate[0]).getTime()

        console.log(checkinInNum, checkoutNum);
        if (checkinInNum <= new Date().getTime() ) {
            return res.status(401).json({error: "You cannot add a date which is backdated"})
        }

        if (checkinInNum >= checkoutNum) {
            return res.status(401).json({error: "Invalid range of input selected"})
        }

        // if(hotelData.countryDatesBooked.includes(checkin) || hotelData.countryDatesBooked.includes(checkout)) {
        //     return res.status(401).json({error: "The hotel is already booked for the dates you want to select."})
        // }

        let myDates = datesGenerator(checkinInNum, checkoutNum);
        
        let clashingDates = false;
        myDates.forEach(ele => {
            if(hotelData.countryDatesBooked.includes(ele)) {
                clashingDates = true;
            }
        })
        if(clashingDates === true) return res.status(401).json({error: "The hotel is already booked for the dates you want to select."})

        myDates.forEach(ele => {
            if(hotelData.countryDatesBooked.includes(ele)) {
                return res.status(401).json({msg: "This hotel is already booked for the date/dates you want to book for"});
            }
        })

        console.log(myDates);
        user.bookings.push({hotelId: hotelId, date: myDates})
        await user.save();

        hotelData.bookings.push({userId: user._id, date: myDates})
        hotelData.countryDatesBooked.push(...myDates)
        await hotelData.save();

        return res.status(200).json({msg: "Booking is complete."});
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

        return res.status(200).json({mybookings: user.bookings})
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({error: "Internal Server Error"})
    }
})



export default router;