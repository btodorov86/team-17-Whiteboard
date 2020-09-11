import { Avatar } from "@material-ui/core";
import React, { useContext, useEffect, useRef, useState } from "react";
import { addResponseMessage, Widget } from "react-chat-widget";
import { SketchPicker } from "react-color";
import AuthContext from "../../../Providers/Context/AuthContext";
import Test from "../../../Test";
import DrawWidget from "./DrawWidget";
import io from 'socket.io-client';

const SingleBoard = ({currentWhiteboard}) => {
  const { user } = useContext(AuthContext);
  const socketRef = useRef();

  const [avatar, setAvatar] = useState("");
  const [color, setColor] = useState("black");
  const [sharedUsers, setSharedUsers] = useState([]);
  const [shareMouse, setShareMouse] = useState({
    isShare: false,
    mouseX: 0,
    mouseY: 0,
  });
  const [message, setMessage] = useState({
    room: user.email,
    from: user.id,
    avatar: user.avatarURL,
  });

  useEffect(() => {
    socketRef.current = io("http://localhost:3000/chat");

    socketRef.current.emit("joinRoom", {
      room: message.room,
      userName: user.userName,
    });

    socketRef.current.on("come-message", (incomingMsg) => {
      setAvatar(
        "https://cnet2.cbsistatic.com/img/liJ9UZA87zs1viJiuEfVnL7YYfw=/940x0/2020/05/18/5bac8cc1-4bd5-4496-a8c3-66a6cd12d0cb/fb-avatar-2.jpg"
      );
      addResponseMessage(incomingMsg.message);
    });
    socketRef.current.on("joinedToRoom", (data) => {
      addResponseMessage(data);
    });

    socketRef.current.on("incomingMousePoints", (data) => {
      // console.log(data);
      const user = sharedUsers.find((x) => x.id === data.userId);
      if (user) {
        setSharedUsers([
          ...sharedUsers,
          {
            ...user,
            mouseX: data.mouseX,
            mouseY: data.mouseY,
          },
        ]);
      } else {
        setSharedUsers([
          ...sharedUsers,
          {
            id: data.id,
            avatar: data.avatar,
            mouseX: data.mouseX,
            mouseY: data.mouseY,
          },
        ]);
      }
    });
  }, []);

  const shareHandler = (e) =>
    setShareMouse({ ...shareMouse, isShare: !shareMouse.isShare });

  const handleNewUserMessage = (data) =>
    socketRef.current.emit("send-message", {
      message: data,
      room: message.room,
      avatar: message.avatar,
    });

  return (
    <React.Fragment>
      <Test color={color} currentWhiteboard={currentWhiteboard} />

      {sharedUsers.length !== 0
        ? sharedUsers.map((user) => (
            <Avatar
              key={user.id}
              src={user.avatar}
              alt={""}
              style={{
                position: "absolute",
                top: user.mouseX,
                left: user.mouseY,
              }}
            />
          ))
        : null}

      <div
        style={{
          position: "absolute",
          marginTop: "60px",
          display: "inline-block",
        }}
      >
        <SketchPicker
          color={color}
          onChange={(color) => {
            setColor(color.hex);
          }}
        />
      </div>
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        // showTimeStamp={false}
        profileAvatar={avatar}
        title={"Chat"}
        display={"inline-block"}
      />
      <DrawWidget shareHandler={shareHandler} />
    </React.Fragment>
  );
};
export default SingleBoard;
