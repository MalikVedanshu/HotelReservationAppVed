import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";


export default function Forgetroute() {
    const navigate = useNavigate()
    const [forgetEmail, setForgetEmail] = useState("")

    const [forgetRouteError, setForgetRouteError] = useState(null);
    const [forgetPassInfo, setForgetPassInfo] = useState("");

    const submitEmail = async () => {
        try {
            let res = await axios.post("/hotelapi/user/forgetpassword", { email: forgetEmail })
            setForgetPassInfo(res.data.msg);
            setTimeout(() => {
                setForgetPassInfo(null);
                navigate("/login")
            }, 3000)
        }
        catch (error) {
            (typeof error.response.data.error === "string") ? setForgetRouteError(error.response.data.error) : setForgetRouteError(error.response.data.error[0].msg)
            setTimeout(() => {
                setForgetRouteError(null);
            }, 2000)
        }
    }

    return (
        <>
            <div className="hundredHeightContainer">
                <center>
                    <div>{forgetRouteError}</div>
                    <div>{forgetPassInfo}</div>
                </center>
                <div className="singuplogin">
                    <div>
                        <div>Email </div>
                        <input type="text" name="email" onChange={(eve) => setForgetEmail(eve.target.value)} placeholder="Enter email" />

                    </div>
                    <div>
                        <div></div>
                        <input type="button" onClick={submitEmail} value="Reset" />
                    </div>

                </div>
                <center>
                    <p> New user ? <Link style={{ textDecoration: "none", color: "rgba(19, 184, 221, 0.857)" }} to='/register' >Register </Link> </p>
                    <p> Already Registered ? <Link style={{ textDecoration: "none", color: "rgba(19, 184, 221, 0.857)" }} to='/login' > Login </Link> </p>
                </center>
            </div>
        </>
    )
}