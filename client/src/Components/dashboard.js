import axios from "axios";
import React, {useState, useEffect} from "react";
export default function Dashboard() {
    let [userData, setUserData] = useState(null)
    const [bookingsError, setBookingsError] = useState(null);
    useEffect(() => {
        let token = localStorage.getItem("htoken");
        
        async function getMyBookings() {
            try {
                let res = await axios.get("/hotelapi/hotels/mybookings", {"headers": {"z-auth-token": token}})
                console.log(res.data);
                setUserData(res.data.mybookings);
            }
            catch(error) {
                console.log(error.response.data);
                setBookingsError(error.response.data.error);
                setTimeout(() => {
                    setBookingsError(null);
                },2000)
            }
        }
        getMyBookings();
    },[])

    return (
    <>
        <h1>Dashboard</h1>
        <div style={{color: "red"}}>{bookingsError}</div>
        <div>
            { userData !== null || userData.length > 0 ? userData.map((ele, idx) => (
                <div> </div>
            )) : <div></div>

            }
        </div>
    </>)
}