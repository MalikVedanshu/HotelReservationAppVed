import CryptoJS from "crypto-js";
import config from 'config';
import jwt from 'jsonwebtoken'

async function authenticatelogin(req,res,next) {
    try {
        let bytes = CryptoJS.AES.decrypt(req.headers["z-auth-token"], config.get("crypt_secret_key"));
        let jwtToken = bytes.toString(CryptoJS.enc.Utf8);
        // console.log(jwtToken);
        let userData = jwt.verify(jwtToken, config.get("jwt_secret_key"));
        // console.log(userData);
        req.payload = userData;
        next();

    }
    catch(error) {
        // console.log(error);
        return res.status(500).json({error: "Internal Server Error"})
    }
}
export default authenticatelogin;