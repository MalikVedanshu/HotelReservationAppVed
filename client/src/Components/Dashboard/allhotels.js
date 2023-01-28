import React, { useEffect, useState } from "react";
import Modal from 'react-modal';
import axios from "axios";

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


export default function Allhotels() {
    const [openModal, setOpenModal] = useState(false);

    const [hotels, setHotels] = useState(null);
    const [checkin, Checkout] = useState([null, null])

    let dateAfterFourtyFiveD = new Date().getTime() + (1000 * 60 * 60 * 24 * 45)

    

    const [hotelPageError, setHotelPageError] = useState(null);

    async function getHotels() {
        try {
            let token = localStorage.getItem("htoken");
            let res = await axios.get("/hotelapi/hotels/search", { headers: { "z-auth-token": token } });
            console.log(res.data.hotels);
            if (res.data.hotels.length > 0) setHotels(res.data.hotels)
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        
        
        const minMaxDate = {
            min: [new Date().getFullYear(),
                new Date().getMonth() + 1,
                new Date().getDate()],
            max: [
                new Date(dateAfterFourtyFiveD).getFullYear(), 
                new Date(dateAfterFourtyFiveD).getMonth() + 1, 
                new Date(dateAfterFourtyFiveD).getDate()
            ]
        }
        minMaxDate.min[1] < 10 ? minMaxDate.min[1] = "0" + minMaxDate.min[1] : "" + minMaxDate.min[1]
        minMaxDate.min[2] < 10 ? minMaxDate.min[2] = "0" + minMaxDate.min[2] : "" + minMaxDate.min[2]

        minMaxDate.max[1] < 10 ? minMaxDate.max[1] = "0" + minMaxDate.max[1] : "" + minMaxDate.max[1]
        minMaxDate.max[2] < 10 ? minMaxDate.max[2] = "0" + minMaxDate.max[2] : "" + minMaxDate.max[2]

        console.log(minMaxDate);
        
        getHotels();
    }, [])

    return (
        <>
        <div>
            {
                hotels !== null ? hotels.map((ele, idx) => (
                    <div key={idx}>

                        <div>{ele.hotelName}</div>
                        <div>{ele.bookingPrice}</div>
                        <input type="button" value="Book" onClick={() => setOpenModal(true)} />
                    </div>
                )) :
                    <div></div>
            }
            </div>
            <Modal isOpen={openModal} style={customStyles}>
                <label>Checkin</label>
                <input type="date" pattern="dd/mm/yyyy" min="2023-01-28" /> <br />
                <label>Checkout</label>
                <input type="date" pattern="dd/mm/yyyy" /><br />
                <input type="button" value="Confirm Dates" /><br />
                <input type="button" value="Close" onClick={() => setOpenModal(false)} />
            </Modal>
        </>
    )
} 