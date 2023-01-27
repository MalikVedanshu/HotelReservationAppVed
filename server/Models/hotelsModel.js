import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
    hotelName: {
        type: String,
        required: true,
        unique: true
    },
    bookingPrice: {
        type: Number,
        required: true
    },
    pictures : {
        type: Array
    },
    bookings: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId
            },
            date: [
                {
                    type: String
                }
            ]
        }
    ]
})

const Hotelmodel = mongoose.model("hotels", hotelSchema, "all-hotels");
export default Hotelmodel;