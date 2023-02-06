import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../Components/navbar.js';

export default function Dashboard() {

    const navigate = useNavigate();

    let [userData, setUserData] = useState(null)
    const [bookingsError, setBookingsError] = useState(null);

    /*
        getMyBookings is called once we load the page, by useEffect.
        it checks :
        a. if there's a htoken in localhost, if not it navigates automatically to /dashboard
        b. makes a network call to /hotelapi/hotels/mybookings and loads all data from response on the page
        c. if any error occurs initially, example if token is expired, it deletes htoken in local host and navigates back to login.
    */

    async function getMyBookings() {
        try {
            
            let token = localStorage.getItem("htoken");
            if (!token) {
                navigate("/login")
            }
            let res = await axios.get("/hotelapi/hotels/mybookings", { "headers": { "z-auth-token": token } })
            if (res.data.mybookings.length > 0) setUserData(res.data.mybookings);

        }
        catch (error) { 
            setBookingsError(error.response.data.error);
            localStorage.removeItem("htoken");
            setTimeout(() => {
                setBookingsError(null);
                navigate("/login")
            }, 2000)
            
            
        }
    }

    /*
        a. if we click on the button Book Now, it will navigate to the page that contains all data of that hotel
        b. button contains id of hotel as name.
    */

    const navigateToHotel = (e) => {
        navigate(`/viewhotel/${e.target.name}`)
    }

    /*eslint-disable */
    useEffect(() => {
        getMyBookings();
    }, [])
    /*eslint-enable */
    
    return (
        <>
            <div className="dashboardContainer">
                <div>
                    <Navbar />
                    <h1>Dashboard</h1>
                    <div style={{ color: "red" }}>{bookingsError}</div>
                    <h3>My Bookings </h3>
                </div>

                <div className="bookingsContainer">

                    {
                    userData !== null ? userData.map((ele, idx) => (
                        <div className="mybooking" key={idx}>
                            <p>{idx + 1}: From <span className="bookingDate">{ele.date[0].split("-").join(".")}</span> to <span className="bookingDate">{ele.date[ele.date.length - 1].split("-").join(".")}</span> </p>
                            <p>You need to pay : <span className="writtenPrice">{ele.totalRent} &#8377; </span> at Hotel </p>
                            <input type="button" name={ele.hotelId} value="View Hotel" onClick={navigateToHotel} />
                        </div>
                    )) : <div></div>
                    }
                </div>
            </div>
        </>)
}