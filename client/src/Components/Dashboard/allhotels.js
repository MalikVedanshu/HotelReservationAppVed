import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar";


export default function Allhotels() {
    const navigate = useNavigate();


    const [hotels, setHotels] = useState(null);
    const [hotelPageError, setHotelPageError] = useState(null);

    const [startFromTo, setStartFromTo] = useState(["", ""])
    const [filters, setFilters] = useState({
        hotelN: "",
        checkinT: "",
        checkoutT: ""
    })

    const changeSearchFilters = (eve) => {
        setFilters({
            ...filters, [eve.target.name]: eve.target.value
        })
    }

    const appyNameFilter = async () => {
        try {
            let token = localStorage.getItem("htoken")
            let res = await axios.get(`/hotelapi/hotels/search/name/${filters.hotelN}`, { headers: { "z-auth-token": token } })
            
            setHotels(res.data.msg);
        }
        catch (error) {
            
            (typeof error.response.data.error === "string") ? setHotelPageError(error.response.data.error) : setHotelPageError(error.response.data.error[0].msg)
            setTimeout(() => {
                setHotelPageError(null);
            }, 2000)
        }

    }

    const applyDateFilter = async () => {
        try {
            let token = localStorage.getItem("htoken")
            let res = await axios.post(`/hotelapi/hotels/search/available`, { checkin: filters.checkinT, checkout: filters.checkoutT }, { headers: { "z-auth-token": token } })
            
            setHotels(res.data.msg);
        }
        catch (error) {
            (typeof error.response.data.error === "string") ? setHotelPageError(error.response.data.error) : setHotelPageError(error.response.data.error[0].msg)
            setTimeout(() => {
                setHotelPageError(null);
            }, 2000)
        }

    }





    async function getHotels() {
        try {
            let token = localStorage.getItem("htoken");
            let res = await axios.get("/hotelapi/hotels/search", { headers: { "z-auth-token": token } });
            if (res.data.hotels.length > 0) setHotels(res.data.hotels)
        }
        catch (error) {
            (typeof error.response.data.error === "string") ? setHotelPageError(error.response.data.error) : setHotelPageError(error.response.data.error[0].msg)
            setTimeout(() => {
                setHotelPageError(null);
            }, 2000)
        }
    }
    const bookTheHotel = (eve) => {
        navigate(`/viewhotel/${eve.target.name}`)
    }
    /* eslint-disable */
    useEffect(() => {

        const min = [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()];

        let maxInMilliseconds = new Date().getTime() + (1000 * 60 * 60 * 24 * 45);

        const max = [new Date(maxInMilliseconds).getFullYear(), new Date(maxInMilliseconds).getMonth() + 1, new Date(maxInMilliseconds).getDate()]


        min[1] < 10 ? min[1] = "0" + min[1] : min[1] = "" + min[1]
        min[2] < 10 ? min[2] = "0" + min[2] : min[2] = "" + min[2]

        max[1] < 10 ? max[1] = "0" + max[1] : max[1] = "" + max[1]
        max[2] < 10 ? max[2] = "0" + max[2] : max[2] = "" + max[2]

        let minDate = `${min[0]}-${min[1]}-${min[2]}`
        let maxDate = `${max[0]}-${max[1]}-${max[2]}`
        setStartFromTo([minDate, maxDate]);
        
        getHotels();
    }, [])
    /* eslint-enable */

    return (
        <>

            <div>
                <center>
                    <Navbar />
                    <div>
                        <div>
                            <input type="text" name="hotelN" onChange={changeSearchFilters} placeholder="Name of Hotel" />
                            <input type="button" value="Search with name" onClick={appyNameFilter} />
                        </div>
                        <div>
                            <input type="date" name="checkinT" onChange={changeSearchFilters} pattern="yyyy/mm/dd" min={startFromTo[0]} max={startFromTo[1]} />
                            <input type="date" name="checkoutT" onChange={changeSearchFilters} pattern="yyyy/mm/dd" min={startFromTo[0]} max={startFromTo[1]} />
                            <input type="button" value="Search with dates available" onClick={applyDateFilter} />
                        </div>

                    </div>
                </center>
                <h3>{hotelPageError} </h3>
                <div className="allHotelContainer">
                    {
                        hotels !== null ? hotels.map((ele, idx) => (
                            <div key={idx} className="allHotelData">

                                <div>{ele.hotelName}</div>
                                <div>Price <span className="writtenPrice">{ele.bookingPrice}&#8377; </span></div>
                                <input type="button" value="Book" name={ele._id} onClick={bookTheHotel} />
                            </div>
                        )) :
                            <div> No Hotels Found</div>
                    }
                </div>
            </div>
        </>
    )
} 