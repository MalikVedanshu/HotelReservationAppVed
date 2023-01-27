import { body, validationResult } from 'express-validator';

function registerValidation() {
    return [
        body("fullname", "Please enter a valid fullname between 3 to 20 characters").isAlpha().isLength({ minLength: 3, maxLength: 20 }),
        body("email", "Please enter a valid email").isEmail().notEmpty(),
        body("password", "Please enter a strong password").isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
    ]
}


function bookingvalidation() {
    return [
        body("hotelId", "Please select the correct option.").isString().notEmpty(),
        body("date", "Invalid dates").custom((value) => {
            if(!Array.isArray(value)) throw Error("Please enter a valid value.")
            value.forEach(ele => {
                if(ele*1 != ele ) throw Error("Please enter a valid value.")
                if(new Date().getTime() > (ele * 1)) {
                    throw Error("You cannot book for backdated")
                }
            })
        })
    ]
}

function errorMiddleware(req, res, next) {
    const error = validationResult(req);
    console.log(error);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() })
    }
    next();
}
export {
    registerValidation,bookingvalidation, errorMiddleware
}