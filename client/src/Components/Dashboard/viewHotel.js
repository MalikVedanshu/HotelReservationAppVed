import axios from "axios";
import React,{useEffect, useState} from "react";
import { useLocation,useNavigate  } from "react-router-dom";
import hotepic from '../../Files/Pictures/hotelpic.jpg';

export default function Viewhotel () {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [hotelData, setHotelData] = useState(null);
    
    async function renderMyHotel () {
       try {
        const token = localStorage.getItem("htoken")
        if(!token) {
            navigate("/login");
        }
        else {
            const hid = location.pathname.split("/viewhotel/")[1]
            let res = await axios.get(`/hotelapi/hotels/search/${hid}`, {headers: {"z-auth-token": token}})
            console.log(res.data);
            setHotelData(res.data.msg);
        }
       }
       catch(error) {
        console.log(error);
       }
    }
    const bookTheHotel = () => {

    }
    useEffect (() => {
        renderMyHotel();
    },[])
    return (
        <>
            <h1>The Hotel </h1>
            {
                hotelData !== null ? 
                <div>
                <h1>{hotelData.hotelName.split("_").join(" ")} </h1>
                <h2>Price : {hotelData.bookingPrice}</h2>
                <img src={hotepic} alt="Hotel Picture" style={{width: "400px", height: "auto"}}></img> <br />
                <input type="date" />
                <input type="date" />
                
                <input type="button" value="Book" onClick={bookTheHotel}/>
                </div> : <div></div>

            }

        </>
    )
}