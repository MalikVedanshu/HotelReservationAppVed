import mongoose from "mongoose";

const userschema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    token: {
        type: String
    },
    bookings: [
        {
            hotelId: {
                type: mongoose.Schema.Types.ObjectId
            },
            date: {
                type: Array
            }
        }
    ]
})

const Usermodel = mongoose.model("User", userschema, "hotel-app-members")
export default Usermodel;