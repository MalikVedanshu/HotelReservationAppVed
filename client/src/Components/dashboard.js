import axios from "axios";
import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../Components/navbar.js';

export default function Dashboard() {

    const navigate = useNavigate();

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
            },2000)
        }
    }

    const navigateToHotel = (e) => {
        navigate(`/viewhotel/${e.target.name}`)
    }

    useEffect(() => {
        
        getMyBookings();
    },[])

    return (
    <>
    <Navbar />
        <h1>Dashboard</h1>
        <div style={{color: "red"}}>{bookingsError}</div>
        <h3>My Bookings </h3>
        <div>
            { userData !== null ? userData.map((ele, idx) => (
                <div>
                <p>{idx + 1}: From {ele.date[0]} to {ele.date[ele.date.length - 1]} </p>
                <input type="button" name={ele.hotelId} value="View Hotel" onClick={navigateToHotel} />
                </div>
            )) : <div></div>

            }
        </div>
    </>)
}