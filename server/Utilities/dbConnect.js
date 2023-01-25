import mongoose from "mongoose";
import config from 'config';

async function dbConnect() {
    try {
        await mongoose.connect(config.get("dbConnectUrl"))
        console.log("Connection to Database successfull.")
    }
    catch(err) {
        console.log(err);
    }
}
dbConnect();
