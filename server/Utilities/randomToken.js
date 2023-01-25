/*
    This function creates a alphanumeric token based on number of digits as parameters
*/

function randomToken(token_digits) {
    let token = "";
    for(let i = 0; i <= token_digits; i+=3) {
        token = token +
        // String.fromCharCode(Math.round(33 + (14 * Math.random())))    // uncomment this if we want any random special character also
        String.fromCharCode(Math.round(48 + (9 * Math.random()))) // adding 1 number
        + String.fromCharCode(Math.round(65 + (25 * Math.random()))) // adding 1 capital character
        + String.fromCharCode(Math.round(97 + (25 * Math.random()))) // adding 1 small character
    }

    token = token.split("").sort(() => 0.5 - Math.random()).join("").slice(0,token_digits); // shuffling the numbers and removing extras 1 or 2 digits
    return token;
}

export default randomToken;