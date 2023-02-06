import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate()

    /*
        removes htoken from localhost
    */

    const logout = () => {
        localStorage.removeItem("htoken")
        navigate("/login")
    }

    return (
        <>

            <div className="navContainer">
                <div className="navElement" onClick={() => navigate("/dashboard")}>Dashboard</div>
                <div className="navElement" onClick={() => navigate("/hotels")}>Hotels</div>

                <div className="navElement" onClick={logout}>Logout</div>
            </div>

        </>
    )
}