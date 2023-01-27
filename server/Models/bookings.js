import mongoose from "mongoose";

const Bookingschema = new mongoose.Schema({
    hotelId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel"
    },
    bookings: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId
            },
            date: {
                type: Array
            }
        }
    ]

})

const Bookingmodel = mongoose.model("bookings", Bookingschema, "bookings")

export default Bookingmodel;