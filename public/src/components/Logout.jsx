import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/ChatInput.css"
export default function Logout() {
  const navigate = useNavigate();
  const handleClick = async () => {
    const id = await JSON.parse(
      localStorage.getItem("chat-app-current-user")
    )._id;
    const data = await axios.get(`http://localhost:5000/api/auth/logout/${id}`);
    if (data.status === 200) {
      localStorage.clear();
      navigate("/login");
    }
  };
  return (
    <button className="lgbtn" onClick={handleClick}>
      Bye!
    </button>
  );
}

