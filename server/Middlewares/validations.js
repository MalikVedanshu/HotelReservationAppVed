import { body, validationResult } from 'express-validator';

function registerValidation() {
    return [
        body("fullname", "Please enter a valid fullname between 3 to 20 characters").isString().notEmpty(),
        body("email", "Please enter a valid email").isEmail().notEmpty(),
        body("password", "Please enter a strong password").isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }),
        body("confirmPassword").custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password did not match');
            }
            return true;
        })
    ]
}

function forgetpassAuthentication() {
    return [
        body("email", "please enter a valid email").isEmail().notEmpty()
    ]
}
function resetpassValidation() {
    return [
        body("password", "Please enter a strong password").isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }),
        body("confirmPassword").custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password did not match');
            }
            return true;
        })
    ]
}

function availabilityDateValidator() {
    return [
        body("checkin").custom(value => {
            // 2023-01-11
            if(value[4] !== "-" && value[7] !== "-") throw new Error('Invalid input');
            return true;
        }),
        body("checkout").custom(value => {
            // 2023-01-11
            if(value[4] !== "-" && value[7] !== "-") throw new Error('Invalid input');
            return true;
        })
    ]
}


function bookingvalidation() {
    return [
        body("hotelId", "Please select the correct option.").isString().notEmpty(),
        body("date", "Invalid dates").custom((value) => {
            if(!Array.isArray(value)) throw Error("Please enter a valid value.")
            if(value.length !== 2) throw Error("Please enter a valid value.")
            // if(value[0].split("-").length !== 3 || value[1].split("-").length !== 3) throw Error("Please enter a valid value.")
            if(value[0][4] !== "-" && value[0][7] !== "-") throw new Error('Invalid input');
            if(value[1][4] !== "-" && value[1][7] !== "-") throw new Error('Invalid input');
            return true;
            
        })
    ]
}



function errorMiddleware(req, res, next) {
    const error = validationResult(req);
    // console.log(error);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() })
    }
    next();
}
export {
    registerValidation, forgetpassAuthentication,availabilityDateValidator, resetpassValidation, bookingvalidation, errorMiddleware
}