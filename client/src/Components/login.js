import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

export default function Customerlogin() {
    const navigate = useNavigate()

    const [loginInputs, setLoginInputs] = useState({
        email: "",
        password: ""
    })
    const [loginError, setLoginError] = useState(null);

    const loginValChange = (eve) => {
        setLoginInputs({
            ...loginInputs, [eve.target.name]: eve.target.value
        })
    }
    const submitLogin = async (eve) => {
        try {
            let res = await axios.post("/hotelapi/user/login", loginInputs);
            console.log(res.data);
            localStorage.setItem("htoken", res.data.token);
            navigate("/dashboard");
        }
        catch (error) {
            console.log(error.response.data);
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