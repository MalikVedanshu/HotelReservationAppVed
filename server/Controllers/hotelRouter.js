import express from 'express';
import mongoose from 'mongoose';
import Usermodel from '../Models/userModel.js';
import Hotelmodel from '../Models/hotelsModel.js';
import datesGenerator from '../Utilities/istDateGenerator.js';
import authenticatelogin from '../Middlewares/authentication.js';
import { bookingvalidation, availabilityDateValidator, errorMiddleware } from '../Middlewares/validations.js';

const router = express.Router();

/*
    API Endpoint : 
    Method : 
    Access type : 
    Validations : 
    Description : 
*/

router.post("/manuallyAddHotels", async (req, res) => {
    try {
        let { hotelName, bookingPrice } = req.body;
        let fixName = "";
        for (let i = 0; i < hotelName.length; i++) {
            hotelName[i] === " " ? fixName += "_" : fixName += hotelName[i]
        }
        let duplicateName = await Hotelmodel.findOne({ hotelName: req.body.hotelName })
        if (duplicateName) return res.status(401).json({ error: "Hotel name is taken. Choose another name" })

        if (req.body.bookingPrice <= 0) return res.status(401).json({ error: "Incorrrect price selected" })

        let myHotel = new Hotelmodel({ hotelName: fixName, bookingPrice: bookingPrice });
        await myHotel.save();

        return res.status(200).json({ msg: "Hotel successfully added" });

    }
    catch (error) {
        return res.status(500).json({ error: "Internal Server Error" })
    }
})

/*
    API Endpoint : /hotelapi/hotels/search
    Method : GET
    Access type : Private 
    Validations : userauthentication
    Description : if user is logged in, it sends all the data of hotels
*/

router.get("/search", authenticatelogin, async (req, res) => {
    try {
        let user = await Usermodel.findById(req.payload.id);
        if (!user) return res.status(200).json({ error: "User not found" })

        if (user.verified === false) return res.status(401).json({ error: "Please veirfy your account first." });

        let allHotels = await Hotelmodel.find();

        return res.status(200).json({ hotels: allHotels })
    }
    catch (error) {
        return res.status(500).json({ error: "Internal Server Error" })
    }
})

/*
    API Endpoint : /hotelapi/hotels/search/*
    Method : GET
    Access type : Private
    Validations : user authentication, valid hotel id
    Description : it sends data of a pirticular hotel as a response and takes hotel ID as req.params
*/

router.get("/search/:hId", authenticatelogin, async (req, res) => {
    try {
        let hId = mongoose.Types.ObjectId(req.params.hId);

        let user = await Usermodel.findById(req.payload.id);
        if (!user) return res.status(200).json({ error: "User not found" })

        if (user.verified === false) return res.status(401).json({ error: "Please veirfy your account first." });

        let theHotel = await Hotelmodel.findById(hId);
        if (!theHotel) return res.status(401).json({ error: "Hotel not found." })

        return res.status(200).json({ msg: theHotel })
    }
    catch (error) {
        return res.status(500).json({ error: "Internal Server Error" })
    }
})

/*
    API Endpoint : /hotelapi/hotels/search/name/*
    Method : GET
    Access type : Private
    Validations : userUthentication, valid name
    Description : by using regex querry, a partial name string in req.params mathes all the hotels mathing the name
*/


router.get("/search/name/:hname", authenticatelogin, async (req, res) => {
    try {
        let { hname } = req.params;
        let user = await Usermodel.findById(req.payload.id);
        if (!user) return res.status(200).json({ error: "User not found" })

        if (user.verified === false) return res.status(401).json({ error: "Please veirfy your account first." });

        let theHotel = await Hotelmodel.find({ hotelName: { $regex: hname, $options: "i" } });
        if (!theHotel) return res.status(401).json({ error: "Hotel not found." })

        return res.status(200).json({ msg: theHotel })
    }
    catch (error) {
        return res.status(500).json({ error: "Internal Server Error" })
    }
})

/*
    API Endpoint : /hotelapi/hotels/search/available
    Method : POST
    Access type : Private
    Validations : valid date input, backdated, dates within 45 days from today
    Description : all the hotels that does not have any bookings within the checkin and checkout date will be sent as response
*/


router.post("/search/available", authenticatelogin, availabilityDateValidator(), errorMiddleware, async (req, res) => {
    try {
        let { checkin, checkout } = req.body;

        let arrCheckIn = checkin.split("-");
        let arrCheckOut = checkout.split("-");

        let checkinMilliseconds = new Date(arrCheckIn[0], arrCheckIn[1] - 1, arrCheckIn[2]).getTime();
        let checkOutMilliseconds = new Date(arrCheckOut[0], arrCheckOut[1] - 1, arrCheckOut[2]).getTime();

        let desiredDatesAndDays = datesGenerator(checkinMilliseconds, checkOutMilliseconds);
        let desiredDates = desiredDatesAndDays["datesArr"];

        let allHotels = await Hotelmodel.find();

        let desiredHotels = []; // filtered result will added to the array

        for (let i = 0; i < allHotels.length; i++) {
            let shouldShow = true;
            if (allHotels[i].countryDatesBooked.length > 0) {
                for (let j = 0; j < desiredDates.length; j++) {
                    if (allHotels[i].countryDatesBooked.includes(desiredDates[j])) {
                        shouldShow = false;
                        j = desiredDates.length;
                    }
                }
            }
            if (shouldShow === true) {
                desiredHotels.push(allHotels[i]);
            }
        }
        return res.status(200).json({ msg: desiredHotels })
    }
    catch (error) {
        return res.status(500).json({ error: "Internal Server Error" })
    }
})

/*
    API Endpoint : /hotelapi/hotels/addbooking
    Method : POST
    Access type : Private
    Validations : valid checkin and checkout date, valid hotelId, dates available to book in database
    Description : if the desired hotel has the requested dates free for booking, the user can place the request to book the hotel
*/


router.post("/addbooking", authenticatelogin, bookingvalidation(), errorMiddleware, async (req, res) => {

    try {

        /*
            User login authentication and verified
        */

        let user = await Usermodel.findById(req.payload.id);
        if (!user) return res.status(401).json({ error: "User not found" })

        if (user.verified === false) return res.status(401).json({ error: "Please veirfy your account first." });


        /*
            Searching hotel and verifying request is valid or not
        */

        let { hotelId, date } = req.body;

        let hotelData = await Hotelmodel.findById(mongoose.Types.ObjectId(hotelId));
        if (!hotelData) return res.status(401).json({ error: "Hotel not found" });



        /*
            converting requested checkin and checkout dates into milliseconds to generate and compare dates in the database 
        */

        let checkinDate = date[0].split("-");
        let checkoutDate = date[1].split("-");

        let checkinInNum = new Date(checkinDate[0], checkinDate[1] - 1, checkinDate[2]).getTime() // checkin date in numbers
        let checkoutNum = new Date(checkoutDate[0], checkoutDate[1] - 1, checkoutDate[2]).getTime() // checkout dates in numbers

        /*
            checking for backdated or date more than 45 days
        */

        // backdated or not
        if (checkinInNum <= new Date().getTime()) {
            return res.status(401).json({ error: "You cannot add a date which is backdated" })
        }
        // checkout should be more than checkin for valid request
        if (checkinInNum >= checkoutNum) {
            return res.status(401).json({ error: "Invalid range of input selected" })
        }

        // request for more than 45 days ahead or not
        if (checkinInNum > new Date().getTime() + (1000 * 60 * 60 * 24 * 45)) {
            return res.status(401).json({ error: "You cannot book only before 45 days." })
        }


        /*
            1. dateGenerator generates all the dates between checkin and checkout
            2. it returns a object with 2 keys, bkDates and dayz
            3. bkDates are all the dates between checkin and checkout
            4. dayz are the count of all the dates between checkin and checkout
            
            location of dateGenerator is /server/Utilities/istDateGenerator.js
        */

        let myDates = datesGenerator(checkinInNum, checkoutNum);

        let oneDayRent = hotelData.bookingPrice;
        let dayzz = myDates["dayz"];
        let totalRent = dayzz * oneDayRent; // total rent ie days multiplied to oneDayRent

        /*
            comparing all the desired dates in array and comparing with the dates in the desired hotel's database
        */
        let bkDates = myDates["datesArr"];
        let doesClash = false;
        let clashingDates = "";

        bkDates.forEach(ele => {
            if (hotelData.countryDatesBooked.includes(ele)) {
                clashingDates = clashingDates + ele + ", ";
                doesClash = true;
            }
        })

        /*
            if desired dates clash with booked dates of hotel, user with get error as response with all the clashing dates
        */

        if (doesClash === true) return res.status(401).json({ error: `The hotel is already booked for ${clashingDates}. You can filter the hotel by dates.` })

        bkDates.forEach(ele => {
            if (hotelData.countryDatesBooked.includes(ele)) {
                return res.status(401).json({ msg: "This hotel is already booked for the date/dates you want to book for" });
            }
        })

        // editing user's database
        user.bookings.push({ hotelId: hotelId, date: bkDates, totalRent: totalRent })
        await user.save();

        // editing hotels database
        hotelData.bookings.push({ userId: user._id, date: bkDates })
        hotelData.countryDatesBooked.push(...bkDates)
        await hotelData.save();

        return res.status(200).json({ msg: "Booking is complete." });
    }
    catch (error) {
        
        return res.status(500).json({ error: "Internal Server Error" })
    }
})

/*
    API Endpoint : /hotelapi/hotels/mybookings
    Method : GET
    Access type : Private 
    Validations : user token authentication
    Description : retuns my booking data so far for all the hotels
*/

router.get("/mybookings", authenticatelogin, async (req, res) => {
    try {
        let user = await Usermodel.findById(req.payload.id);
        if (!user) return res.status(401).json({ error: "User not found" })
        if (user.verified === false) return res.status(401).json({ error: "Please veirfy your account first." });
        return res.status(200).json({ mybookings: user.bookings })
    }
    catch (error) {
        return res.status(500).json({ error: "Internal Server Error" })
    }
})



export default router;