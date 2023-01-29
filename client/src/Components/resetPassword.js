import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function Resetpassword() {
    const navigate = useNavigate()
    const location = useLocation();

    const [passwordsState, setPasswordsState] = useState({
        password: "",
        confirmPassword: ""
    })

    const [resetPassError, setResetPassError] = useState(null);
    const [resetPassInfo, setResetPassInfo] = useState("");

    const onPasswordInput = (eve) => {
        setPasswordsState({
            ...passwordsState, [eve.target.name]: eve.target.value
        })
    }


    const submitPassword = async () => {
        try {
            const tkn = location.pathname.split("/resetpassword/")[1]
            let res = await axios.post(`/hotelapi/user/resetpass/${tkn}`, passwordsState)
            setResetPassInfo(res.data.msg)
            setTimeout(() => {
                navigate("/login")
            }, 3000)
        }
        catch (error) {
            (typeof error.response.data.error === "string") ? setResetPassError(error.response.data.error) : setResetPassError(error.response.data.error[0].msg)
            setTimeout(() => {
                setResetPassError(null);
            }, 2000)
        }
    }

    return (
        <>
            <div>{resetPassError}</div>
            <div>{resetPassInfo}</div>
            <input type="password" name="password" onChange={onPasswordInput} placeholder="Enter Password" />
            <input type="password" name="confirmPassword" onChange={onPasswordInput} placeholder="Enter Password" />
            <input type="button" value={"Submit Password"} onClick={submitPassword} />
        </>
    )
}