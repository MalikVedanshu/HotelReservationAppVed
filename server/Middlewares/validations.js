import {body, validationResult} from 'express-validator';

function registerValidation() {
    body("fullname", "Please enter a valid fullname between 3 to 20 characters").isAlpha().isLength({min: 3, max: 20}),
    body("email", "Please enter a valid email").isEmail().notEmpty(),
    body("password", "Please enter a strong password").isStrongPassword({minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols:1})
}

function errorMiddleware (req,res,next) {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error: error.array()})
    }
    next();
}
export {
    registerValidation, errorMiddleware
}