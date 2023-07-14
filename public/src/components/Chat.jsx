import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import ChatBox from "./ChatBox";
import People from "./People";
import "../Styles/Chat.css"

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    async function lcl(){
      if (!localStorage.getItem("chat-app-current-user")) {
        navigate("/login");
      } else {
        setCurrentUser(
          await JSON.parse(
            localStorage.getItem("chat-app-current-user")
          )
        );
      }
    }
    lcl();
    
  }, []);
  useEffect(() => {
    if (currentUser) {
      socket.current = io(`http://localhost:5000`);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    async function lgg(){
      if (currentUser) {
        const data = await axios.get(`http://localhost:5000/api/auth/allusers/${currentUser._id}`);
        setContacts(data.data);
      } 
    }
    lgg()
    }
  , [currentUser]);
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  return (
    <>
      <div className="Container">
        <div className="container">
          {currentChat === undefined ? (
            <>
            <div>
              
            </div>
            </>
          ) : (
            <ChatBox currentChat={currentChat} socket={socket} />
          )}
          <People contacts={contacts} changeChat={handleChatChange} />

        </div>
      </div>
    </>
  );
}

