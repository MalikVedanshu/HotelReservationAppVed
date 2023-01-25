import express from 'express';

const router = express.Router();


router.post("/mybookings", async (req, res) => {
    try {
        return res.status(200).json({msg: "bookings"})
    }
    catch(error) {
        console.log(error.response);
        return res.status(500).json({error: "Internal Server error"})
    }
})

export default router;