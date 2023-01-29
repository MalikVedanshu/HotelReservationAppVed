import express from 'express';
import bcrypt from 'bcrypt';
import randomToken from '../Utilities/randomToken.js';
import sendEmail from '../Utilities/sendEmail.js';
import Usermodel from '../Models/userModel.js'
import jwt from 'jsonwebtoken';
import config from 'config';
import CryptoJS from 'crypto-js';
import {registerValidation, forgetpassAuthentication,resetpassValidation, errorMiddleware} from '../Middlewares/validations.js';
import authenticatelogin from '../Middlewares/authentication.js';

const router = express.Router();

/*
    API Endpoint : /hotelapi/user/register
    Method : post
    Access type : Public
    Validations : registerValidation
    Description : takes input or name email password, checks if details are valid, sends data to server and a email to use for verification.
*/

router.post("/register",registerValidation(), errorMiddleware, async (req, res) => {
    try {
        let {fullname, email, password} = req.body;

        // checking if user already exists
        let existingUser = await Usermodel.findOne({email: email});
        if(existingUser) return res.status(401).json({error: "User already exists. Please login or register with different account."})

        // creating database
        let newUser = new Usermodel(req.body);


        newUser.password = await bcrypt.hash(password, 12); // hashing password
        newUser.token = randomToken(8); // generating random alphanumberic token
        await newUser.save(); // saving data in the database

        // sending email with jwt token valid for 2 hours

        let jwtToken = jwt.sign({email: email, tkn: newUser.token} , config.get("jwt_secret_key"), {expiresIn: '2h'})

        await sendEmail({
            toAddress: email,
            emailSubject: `Account verification. Hotel Bookings.`,
            emailBody: `
            <div>
                <h1> Hello ${fullname}, Thank you for registering with us. </h1>
                <div>Please <a href="${config.get('myIP')}:5000/hotelapi/user/verify/${jwtToken}"> click here </a> to verify your account </div>
            </div>
            `
        })
        return res.status(200).json({msg: "Registeration successfull, Please click on the link sent on your registered email."})
    }
    catch(error) {
       
        return res.status(500).json({error: "Internal Server error"})
    }
})

/*
    API Endpoint : /verify/*
    Method : get
    Access type : public
    Validations : verify valid token(jwt)
    Description : This route takes Token as parameters sent on mail, if token is valid, it saves verified = true in the database. 
*/

router.get("/verify/:vtkn", async (req,res) => {
    try {
        let vtkn = req.params.vtkn;
        let verifiedTokenData = jwt.verify(vtkn, config.get("jwt_secret_key"));
    
        // condition for if user not found
        let user = await Usermodel.findOne({email: verifiedTokenData.email});
        if(!user) return res.status(401).json({error: "Invalid token"});

        if(verifiedTokenData.tkn !== user.token ) return res.status(401).json({error: "Invalid token"});
    
        // condition if already verified
        if(user.verified === true) return res.status(400).json({error: "Account is already verified"});
    
        // verifying account and save database
        user.verified = true;
        await user.save();
        return res.status(200).json({msg: "Your account is verified."})
    }
    catch (error) {
        
        return res.status(500).json({error: "Internal Server error"})
    }
})

/*
    API Endpoint : /hotelapi/user/forgetpassword
    Method : post
    Access type : public
    Validations : valid email
    Description : User can get a jwt encoded token on the email by sending request to reset password
*/


router.post("/forgetpassword", forgetpassAuthentication(),errorMiddleware, async (req,res) => {
    try {
        let email = req.body.email;
        let user = await Usermodel.findOne({email: email});
        if(!user) return res.status(401).json({error: "Email is not registered. You can create a account by signing up"})

        user.token = randomToken(8); // generating random alphanumberic token
        await user.save(); // saving data in the database

        // sending email with jwt token valid for 2 hours

        let jwtToken = jwt.sign({email: email, tkn: user.token} , config.get("jwt_secret_key"), {expiresIn: '1h'})

        await sendEmail({
            toAddress: email,
            emailSubject: `Reset Password. Hotel Bookings.`,
            emailBody: `
            <div>
                <h1> Hello ${user.fullname}, </h1>
                <div> Please <a href="${config.get('myIP')}:3000/resetpassword/${jwtToken}"> click here </a> reset your password. </div>
            </div>
            `
        })
        return res.status(200).json({msg: "An email has been sent on your registered account. Please click on the link in the email and reset your password"})
    }
    catch(error) {
        
        return res.status(500).json({error: "Internal Server error"})
    }
})

/*
    API Endpoint : /hotelapi/user/resetpass/*
    Method : post
    Access type : Public
    Validations : valid password, valid confirm password, valid token
    Description : token sent on the mail as req.params gets verified and new password is updated in the database
*/

router.post("/resetpass/:jwtkn",resetpassValidation(),errorMiddleware, async (req,res) => {
    try {
        let jwtkn = req.params.jwtkn;
        let password = req.body.password;
        
        let verifiedTokenData = jwt.verify(jwtkn, config.get("jwt_secret_key"))
        if (!verifiedTokenData) return res.status(401).json({error: "Invalid token. "})

        let user = await Usermodel.findOne({email: verifiedTokenData.email})
        if(!user) return res.status(401).json({error: "Invalid token. "})

        if(verifiedTokenData.tkn !== user.token) return res.status(401).json({error: "Invalid token. "})

        let hashedPassword = await bcrypt.hash(password, 12);

        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({msg: "Password reset successfully"})

    }
    catch(error) {
        return res.status(500).json({error: "Internal Server error"})
    }
})


/*
    API Endpoint : /hotelapi/user/login
    Method : Post
    Access type : Public 
    Validations : NA
    Description : It verified the email and hashed password in the database and sends a encrypted token as a response for further authentications
*/


router.post("/login", async (req,res) => {
    try {
        let {email, password} = req.body;
        let user = await Usermodel.findOne({email: email});
        if(!user) return res.status(401).json({error: "Invalid credentials, check your email or password"});

        if(user.verified === false) return res.status(401).json({error: "Please veirfy your account first."});


        let verifiedPassword = await bcrypt.compare(password, user.password);
        if(!verifiedPassword) return res.status(401).json({error: "Invalid credentials, check your email or password"});

        let jwtToken = jwt.sign({id: user._id, email: user.email}, config.get("jwt_secret_key"), {expiresIn: "2h"});
        let encryptedJwtToken = CryptoJS.AES.encrypt(jwtToken, config.get("crypt_secret_key")).toString();
        // let token = "random"

        return res.status(200).json({token: encryptedJwtToken})
    }
    catch(error) {
        return res.status(500).json({error: "Internal Server error"})
    }
})

// testing ignore

router.get("/verifyme", authenticatelogin, async (req, res) => {
    try {
        let user = await Usermodel.findById(req.payload.id);
        if(!user) return res.status(401).json({error: "Invalid token. Login again"});
        if(user.verified === false) return res.status(401).json({error: "Please veirfy your account first."});
        
        return res.status(200).json({msg: "You are autherised"})
    }
    catch (error) {

        return res.status(500).json({error: "Internal Server error"})
    }
})

export default router;