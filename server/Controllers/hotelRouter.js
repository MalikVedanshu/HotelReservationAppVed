import express from 'express';
import Usermodel from '../Models/userModel.js';
import Hotelmodel from '../Models/hotelsModel.js';
import authenticatelogin from '../Middlewares/authentication.js';

const router = express.Router();

router.get("/search",authenticatelogin, async (req,res) => {
    try {
        let user = await Usermodel.findById(req.payload.id);
        if(!user) return res.status(200).json({error: "User not found"})
        let allHotels = await Hotelmodel.find().limit(10);
        return res.status(200).json({msg: allHotels})
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({error: "Internal Server Error"})
    }
})

router.post("/addbooking",authenticatelogin, async (req,res) => {
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


router.post("/manuallyAddHotels", async(req, res) => {
    try {
        // let {hotelName, bookingPrice } = req.body;
        let myHotel = new Hotelmodel(req.body);
        myHotel.save();
        return res.status(200).json({msg: "Hotel successfully added"});

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({error: "Internal Server Error"})
    }
})




export default router;