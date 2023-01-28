import axios from "axios";
import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {

    const navigate = useNavigate()
    
    let [userData, setUserData] = useState(null)
    const [bookingsError, setBookingsError] = useState(null);

    async function getMyBookings() {
        try {
            let token = localStorage.getItem("htoken");
            if(!token) {
                navigate("/login")
            }
            let res = await axios.get("/hotelapi/hotels/mybookings", {"headers": {"z-auth-token": token}})
            console.log(res.data);
            if(res.data.mybookings.length > 0) setUserData(res.data.mybookings);
            
        }
        catch(error) {
            console.log(error.response.data);
            setBookingsError(error.response.data.error);
            setTimeout(() => {
                setBookingsError(null);
                navigate("/login")
            },2000)
        }
    }

    useEffect(() => {
        
        getMyBookings();
    },[])

    return (
    <>
        <h1>Dashboard</h1>
        <div style={{color: "red"}}>{bookingsError}</div>
        <h3>My Bookings </h3>
        <div>
            { userData !== null ? userData.map((ele, idx) => (
                <div>{} </div>
            )) : <div></div>

            }
        </div>
    </>)
}