import React, { useContext, useEffect, useRef, useState } from 'react';
import { Widget, addResponseMessage } from "react-chat-widget";
import AuthContext from '../../../Providers/Context/AuthContext';
import io from "socket.io-client";


const Chat = ({currentWhiteboard}) => {
    const { user } = useContext(AuthContext);

    const [avatar, setAvatar] = useState("");

    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = io("http://localhost:3000/chat");

        socketRef.current.on("come-message", (incomingMsg) => {
          setAvatar(
            "https://cnet2.cbsistatic.com/img/liJ9UZA87zs1viJiuEfVnL7YYfw=/940x0/2020/05/18/5bac8cc1-4bd5-4496-a8c3-66a6cd12d0cb/fb-avatar-2.jpg"
          );
          addResponseMessage(incomingMsg.message);
        });
        socketRef.current.on("joinedToRoom", (data) => {
          addResponseMessage(data);
        });

        if (currentWhiteboard && user) {
          socketRef.current.emit("joinRoom", {
            room: currentWhiteboard.id,
            userName: user.userName,
          });
        }

      }, []);

    const handleNewUserMessage = (data) =>
    socketRef.current.emit("send-message", {
      message: data,
      room: currentWhiteboard.id,
      avatar: user.avatar,
    });

    return user ? (
        <Widget
        handleNewUserMessage={handleNewUserMessage}
        // showTimeStamp={false}
        profileAvatar={avatar}
        title={"Chat"}
        display={"inline-block"}
      />
    ) : null

};

export default Chat
