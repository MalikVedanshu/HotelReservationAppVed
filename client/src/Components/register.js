import React,{useState} from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
            ...registerState, [eve.target.name] : eve.target.value
        })
    }
    const submitRegisteration = async () => {
        try {
            let res = await axios.post("/hotelapi/user/register", registerState)
            console.log(res.data.msg);
            setRegisterInfo(res.data.msg);
            setTimeout(() => {
                setRegisterInfo(null);
            },3000)
            setTimeout(() => {
                navigate("/dashboard");
            },4000)
        }
        catch(error) {
            console.log(error.response.data);

            (typeof error.response.data.error === "string" ) ? setRegisterError(error.response.data.error) : setRegisterError(error.response.data.error[0].msg)
            setTimeout(() => {
                setRegisterError(null);
            },2000)
        }
    }


    return (
        <>
            <h2> Register </h2>

            <div style={{color: "red"}}>{registerError}</div>
            <div style={{color: "green"}}>{registerInfo}</div>

            <label>Full-Name</label>
            <input type="text" name="fullname" onChange={onRegisterPageChange} /><br />
            <label>Email</label>
            <input type="text" name="email" onChange={onRegisterPageChange} /><br />
            <label>Password</label>
            <input type="text" name="password" onChange={onRegisterPageChange} /><br />
            <label>Confirm Password</label>
            <input type="text" name="confirmPassword" onChange={onRegisterPageChange} /> <br />
            <input type="button" onClick={submitRegisteration} value="Register" />
        </>
    )
}