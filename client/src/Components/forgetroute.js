import React,{useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function Forgetroute() {
    const navigate = useNavigate()
    const [forgetEmail, setForgetEmail]= useState ("")

    const [forgetRouteError, setForgetRouteError] = useState(null);
    const [forgetPassInfo, setForgetPassInfo] = useState("");

    const submitEmail = async () => {
        try {
            let res = await axios.post("/hotelapi/user/forgetpassword", {email: forgetEmail})
            console.log(res.data);
            setForgetPassInfo(res.data.msg);
            setTimeout(() => {
                setForgetPassInfo(null);
                navigate("/login")
            },3000)
        }
        catch(error) {
            console.log(error.response.data);
            (typeof error.response.data.error === "string" ) ? setForgetRouteError(error.response.data.error) : setForgetRouteError(error.response.data.error[0].msg)
            setTimeout(() => {
                setForgetRouteError(null);
            },2000)
        }
    }

    return (
        <>
            <div>{forgetRouteError}</div>
            <div>{forgetPassInfo}</div>
            <input type="text" name="email" onChange={(eve) => setForgetEmail(eve.target.value)} placeholder="enter email" />
            <input type="button" onClick={submitEmail} value="Reset" />
        </>
    )
}