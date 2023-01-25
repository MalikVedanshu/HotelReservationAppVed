import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
    hotelName: {
        type: String,
        required: true,
        unique: true
    },
    bookingPrice: {
        type: String,
        required: true
    },
    bookings: [
        {
            date: {
                type: Array
            },
            member: {
                type: String
            }
        }
    ]
})

const Hotelmodel = mongoose.model("hotels", hotelSchema, "all-hotels");
export default Hotelmodel;