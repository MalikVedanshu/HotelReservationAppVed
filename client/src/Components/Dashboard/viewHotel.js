import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import hotepic from '../../Files/Pictures/hotelpic.jpg';
import Navbar from "../navbar";
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

Modal.setAppElement('#modal_root');

export default function Viewhotel() {
    const location = useLocation();
    const navigate = useNavigate();

    const [hotelData, setHotelData] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openHistoryModal, setOpenHistoryModal] = useState(false);
    const [hisrotyModalData, setHistoryModalData] = useState(null);

    const [bookingsData, setBookingsData] = useState({
        checkin: "",
        checkout: ""
    })
    const [bookingsError, setBookingsError] = useState(null);
    const [bookingsInfo, setBookingsInfo] = useState(null);

    const triggerBookingsDate = (eve) => {
        setBookingsData({
            ...bookingsData, [eve.target.name]: eve.target.value
        }) 
    }

    async function renderMyHotel() {
        try {
            const token = localStorage.getItem("htoken")
            if (!token) {
                navigate("/login");
            }
            else {
                const hid = location.pathname.split("/viewhotel/")[1]
                let res = await axios.get(`/hotelapi/hotels/search/${hid}`, { headers: { "z-auth-token": token } })
                console.log(res.data);
                setHotelData(res.data.msg);
                setHistoryModalData(res.data.msg.countryDatesBooked);
            }
        }
        catch (error) {
            console.log(error.response.data);
            (typeof error.response.data.error === "string") ? setBookingsError(error.response.data.error) : setBookingsError(error.response.data.error[0].msg)
            setTimeout(() => {
                setBookingsError(null);
            }, 2000)
        }
    }
    const bookTheHotel = async () => {
        try {
            let token = localStorage.getItem("htoken");
            let res = await axios.post("/hotelapi/hotels/addbooking", { hotelId: hotelData._id, date: [bookingsData.checkin, bookingsData.checkout] }, { headers: { "z-auth-token": token } })
            console.log(res.data)
            setOpenModal(false);
            setTimeout(() => {
                setBookingsInfo(null);
            },3000)
        }
        catch (error) {
            console.log(error.response.data);
            (typeof error.response.data.error === "string") ? setBookingsError(error.response.data.error) : setBookingsError(error.response.data.error[0].msg)
            setTimeout(() => {
                setBookingsError(null);
            }, 2000)
        }
    }
    useEffect(() => {
        renderMyHotel();
    }, [])
    return (
        <>
        <Navbar />
            
            <div style={{color: "red"}}>{bookingsError}</div>
            <div style={{color: "green"}}>{bookingsInfo}</div>
            {
                hotelData !== null ?
                    <div className="hotelDataContainer">
                        <h1 className="hotelName">{hotelData.hotelName.split("_").join(" ")} </h1>
                        <h2>Price : {hotelData.bookingPrice} Rupees </h2>
                        <img src={hotepic} alt="ahotel" style={{ width: "400px", height: "auto" }}></img> <br />
                        <input type="button" value="Book" onClick={() => setOpenModal(true)} /> <br />
                        <input type="button" value="View booking history" onClick={() => setOpenHistoryModal(true)} />
                    </div> : <div></div>
            }
            <Modal isOpen={openModal} style={customStyles}>
                <input type="date" name="checkin" onChange={triggerBookingsDate} />
                <input type="date" name="checkout" onChange={triggerBookingsDate} />
                <input type="button" value="Confirm" onClick={bookTheHotel} />
                <input type="button" value="Close" onClick={() => setOpenModal(false)} />
            </Modal>
            <Modal isOpen={openHistoryModal} style={customStyles}>

                <div> This Hotel is booked for following dates.</div>
                {
                    hisrotyModalData !== null ?  hisrotyModalData.length > 0 ? hisrotyModalData.map(ele => (
                    <div>
                        {ele.split("-").join(".")}
                    </div>
                    ))
                     : <div>None </div> : <div></div>
                }
                <input type="button" value="Close" onClick={() => setOpenHistoryModal(false)} />
            </Modal>

        </>
    )
}