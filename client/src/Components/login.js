import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

export default function Customerlogin() {
    const navigate = useNavigate()

    /* 
    login state
    */
    const [loginInputs, setLoginInputs] = useState({
        email: "",
        password: ""
    })
    const [loginError, setLoginError] = useState(null); // error state from api calls

    /* 
        loginInputs state change whenever we input our credential
    */
    const loginValChange = (eve) => {
        setLoginInputs({
            ...loginInputs, [eve.target.name]: eve.target.value
        })
    }

    /* 
        after we submit our login credentials, 
        if success : saves htoken in localhost recieved from server and navigates to /dashboard
        if fail : shows error message for 2 seconds and stays on login page
    */
    const submitLogin = async () => {
        try {
            let res = await axios.post("/hotelapi/user/login", loginInputs);
            localStorage.setItem("htoken", res.data.token);
            navigate("/dashboard");
        }
        catch (error) {
            (typeof error.response.data.error === "string") ? setLoginError(error.response.data.error) : setLoginError(error.response.data.error[0].msg)
            setTimeout(() => {
                setLoginError(null);
            }, 2000)
        }
    }


    return (
        <>
            <div className="hundredHeightContainer">

                <div style={{ color: "red" }}>{loginError}</div>
                <div className="singuplogin">
                    <h1>Login</h1>
                    <div>
                        <div> Email </div>
                        <input type="text" name="email" onChange={loginValChange} placeholder="Enter Email" />
                    </div>

                    <div>
                        <div> Password </div>
                        <input type="password" name="password" onChange={loginValChange} placeholder="Enter Password" />
                    </div>
                    <div>
                        <div></div>
                        <input type="submit" onClick={submitLogin} />
                    </div>

                </div>
                <center>
                    <p> New user ? <Link style={{ color: "rgba(19, 184, 221, 0.857)", fontFamily: "Verdana, Geneva, Tahoma, sans-serif" }} to='/register' >Register </Link>  </p>
                    <p> Forgot Password/Username ?  <Link style={{ color: "rgba(19, 184, 221, 0.857)", fontFamily: "Verdana, Geneva, Tahoma, sans-serif" }} to='/forgetpassword' > Click here </Link> </p>
                </center>



            </div>
        </>
    )
}