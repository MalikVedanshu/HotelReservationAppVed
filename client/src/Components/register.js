import React, { useState } from "react"
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Customerregister() {
    const navigate = useNavigate();

    const [registerState, setRegisterState] = useState({
        fullname: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const [registerError, setRegisterError] = useState(null);
    const [registerInfo, setRegisterInfo] = useState(null);

    const onRegisterPageChange = (eve) => {
        setRegisterState({
            ...registerState, [eve.target.name]: eve.target.value
        })
    }
    const submitRegisteration = async () => {
        try {
            let res = await axios.post("/hotelapi/user/register", registerState)

            setRegisterInfo(res.data.msg);
            setTimeout(() => {
                setRegisterInfo(null);
            }, 3000)
            setTimeout(() => {
                navigate("/login");
            }, 4000)
        }
        catch (error) {

            (typeof error.response.data.error === "string") ? setRegisterError(error.response.data.error) : setRegisterError(error.response.data.error[0].msg)
            setTimeout(() => {
                setRegisterError(null);
            }, 2000)
        }
    }


    return (
        <>
            <div className="hundredHeightContainer">
                <center>
                    <div style={{ color: "red" }}>{registerError}</div>
                    <div style={{ color: "green" }}>{registerInfo}</div>
                </center>
                <div className="singuplogin">
                    <h2> Register </h2>
                    <div>
                        <div>Full-Name</div>
                        <input type="text" name="fullname" onChange={onRegisterPageChange} /><br />
                    </div>
                    <div>
                        <div>Email</div>
                        <input type="text" name="email" onChange={onRegisterPageChange} /><br />
                    </div>
                    <div>
                        <div>Password</div>
                        <input type="password" name="password" onChange={onRegisterPageChange} /><br />
                    </div>
                    <div>
                        <div>Confirm Password</div>
                        <input type="password" name="confirmPassword" onChange={onRegisterPageChange} /> <br />
                    </div>
                    <div>
                        <div></div>
                        <input type="button" onClick={submitRegisteration} value="Register" />
                    </div>
                </div>
                <center>
                    <p> Already Registered ? <Link style={{ textDecoration: "none", color: "rgba(19, 184, 221, 0.857)" }} to='/login' >Login </Link> </p>
                    <p> Forgot Password/Username ? <Link style={{ textDecoration: "none", color: "rgba(19, 184, 221, 0.857)" }} to='/forgetpassword' > Click here </Link> </p>
                </center>
            </div>
        </>

    )
}