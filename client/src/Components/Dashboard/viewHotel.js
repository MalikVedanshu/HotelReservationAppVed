import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import hotel from '../../Files/Pictures/hotelpic.jpg';
import Navbar from "../navbar";
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    },
};

Modal.setAppElement('#modal_root');

export default function Viewhotel() {
    const location = useLocation();
    const navigate = useNavigate();

    /*
        All states view hotel page
    */

    const [hotelData, setHotelData] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openHistoryModal, setOpenHistoryModal] = useState(false);
    const [hisrotyModalData, setHistoryModalData] = useState(null);

    const [bookingsData, setBookingsData] = useState({
        checkin: "",
        checkout: ""
    })

    /*
        States to show info
    */
    const [bookingsError, setBookingsError] = useState(null);
    const [bookingsInfo, setBookingsInfo] = useState(null);

    /*
        Any Change in checkin/checloud date will be updated in the state
    */
    const triggerBookingsDate = (eve) => {
        setBookingsData({
            ...bookingsData, [eve.target.name]: eve.target.value
        })
    }
    /*
        everytime the page will load,
        a api request to load the hotel data, booking hisotry will be loaded on the api request /hotelapi/hotels/search/:hotelId
        htoken in local host is sent as headers > z-auth-token in the request
        if no token is there in the localhost, page will navigate to /login route
        state is updated according to the data recieved on request
    */
    
    async function renderMyHotel() {
        try {
            const token = localStorage.getItem("htoken")
            if (!token) {
                navigate("/login");
            }
            else {
                const hid = location.pathname.split("/viewhotel/")[1]
                let res = await axios.get(`/hotelapi/hotels/search/${hid}`, { headers: { "z-auth-token": token } })

                setHotelData(res.data.msg);
                setHistoryModalData(res.data.msg.countryDatesBooked);
            }
        }
        catch (error) {

            (typeof error.response.data.error === "string") ? setBookingsError(error.response.data.error) : setBookingsError(error.response.data.error[0].msg)
            setTimeout(() => {
                setBookingsError(null);
            }, 2000)
        }
    }

    /*
        inside the modal, once dates are selected, and we click on confirm,
        a axios call to /hotelapi/hotels/addbooking is sent,
        state of info is updated accordingly.
    */

    const bookTheHotel = async () => {
        try {
            let token = localStorage.getItem("htoken");
            let res = await axios.post("/hotelapi/hotels/addbooking", { hotelId: hotelData._id, date: [bookingsData.checkin, bookingsData.checkout] }, { headers: { "z-auth-token": token } })
            setBookingsInfo(res.data.msg);
            setOpenModal(false);
            setTimeout(() => {
                setBookingsInfo(null);
            }, 3000)
        }
        catch (error) {
            setOpenModal(false);
            (typeof error.response.data.error === "string") ? setBookingsError(error.response.data.error) : setBookingsError(error.response.data.error[0].msg)
            setTimeout(() => {
                setBookingsError(null);
            }, 2000)
        }
    }
    /*eslint-disable */
    useEffect(() => {
        renderMyHotel();
    }, [])
    /*eslint-enable */
    return (
        <>
            <div className="hoteViewContainer">
                <Navbar />
<div  className="infoAfterApiCall">
                <h1 style={{ color: "red"}} className="infoItem">{bookingsError}</h1>
                <h1 style={{ color: "green" }} className="infoItem">{bookingsInfo}</h1>
</div>
                {

                    hotelData !== null ?
                        <div className="hotelDataContainer">
                            <h1 className="hotelName">{hotelData.hotelName.split("_").join(" ")} </h1>
                            <h2>Price : {hotelData.bookingPrice} Rupees </h2>
                            <img src={require(`../../Files/Pictures/hotelPictures/hotel6.jpg`)} alt="ahotel" style={{ width: "auto", height: "400px" }}></img> <br />
                            <input type="button" value="Book" onClick={() => setOpenModal(true)} /> <br />
                            <input type="button" value="View booking history" onClick={() => setOpenHistoryModal(true)} />
                        </div> : <div></div>
                }

                <Modal isOpen={openModal} style={customStyles}>

                    <div className="bookModal">
                        <div>
                            <label>Checkin Date</label>
                            <input type="date" name="checkin" onChange={triggerBookingsDate} />
                        </div>
                        <div>
                            <label>Checkout Date</label>
                            <input type="date" name="checkout" onChange={triggerBookingsDate} />
                        </div>
                        <div>
                            <input type="button" value="Confirm" onClick={bookTheHotel} />
                            <input type="button" value="Close" onClick={() => setOpenModal(false)} />
                        </div>
                    </div>

                </Modal>
                <Modal isOpen={openHistoryModal} style={customStyles}>

                    <div> This Hotel is booked for following dates.</div>
                    {
                        hisrotyModalData !== null ? hisrotyModalData.length > 0 ? hisrotyModalData.map((ele, idxx) => (
                            <div key={idxx}>
                                {ele.split("-").join(".")}
                            </div>
                        ))
                            : <div>None </div> : <div></div>
                    }
                    <input type="button" value="Close" onClick={() => setOpenHistoryModal(false)} />
                </Modal>
            </div>
        </>
    )
}