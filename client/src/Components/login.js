import React, { useState } from "react";
import {useNavigate} from 'react-router-dom';
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
            ...loginInputs, [eve.target.name] : eve.target.value
        })
    }
    const submitLogin = async (eve) => {
        try {
            let res = await axios.post("/hotelapi/user/login", loginInputs);
            console.log(res.data);
            localStorage.setItem("htoken", res.data.token);
            navigate("/dashboard");
        }
        catch(error) {
            console.log(error.response.data);
            setLoginError(error.response.data.error);
            setTimeout(() => {
                setLoginError(null);
            },2000)
        }
    }
    

    return (
        <>
            <div>
                <h2> Login </h2>
                <div style={{color:"red"}}>{loginError}</div>
                <label> Email </label>
                <input type="text" name="email" onChange={loginValChange} placeholder="Enter Email" />

                <label> Password </label>
                <input type="text" name="password" onChange={loginValChange} placeholder="Enter Password" />
                <input type="submit" onClick={submitLogin} />
            </div>
        </>
    )
}