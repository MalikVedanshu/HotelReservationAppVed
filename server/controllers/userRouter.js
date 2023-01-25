import express from 'express';

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        return res.status(200).json({msg: "Registeration successfull, Please click on the link sent on your registered email."})
    }
    catch(error) {
        console.log(error.response);
        return res.status(500).json({error: "Internal Server error"})
    }
})

router.post("/login", async (req,res) => {
    try {
        return res.status(200).json({msg: "User Login successfull"})
    }
    catch(error) {
        console.log(error.response);
        return res.status(500).json({error: "Internal Server error"})
    }
})

export default router;