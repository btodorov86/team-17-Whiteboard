import React, { useContext, useEffect, useRef, useState } from "react";
import { Stage, Layer, Line } from 'react-konva';
import propTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import AuthContext from './Providers/Context/AuthContext';
import io from 'socket.io-client';
import { Avatar } from '@material-ui/core';
import { Widget, addResponseMessage } from 'react-chat-widget';
// import

const Test = ({color, isShare}) => {

  const { user } = useContext(AuthContext);
  const socketRef = useRef();

    const [line, setline] = useState({
        points: [],
        drawing: false,
        stroke: 'black'
      })
    const [shapes, setShapes] = useState([]);
    const [message, setMessage] = useState({
      room: user.email,
      from: user.id,
      avatar: user.avatarURL,
    });
    const [avatar, setAvatar] = useState("");
    const [sharedUsers, setSharedUsers] = useState([]);
    const [shareMouse, setShareMouse] = useState({
      // isShare: false,
      mouseX: 0,
      mouseY: 0,
    });
    // console.log(shareMouse);
    // console.log(isShare);

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

        socketRef.current.emit("joinRoom", {
          room: message.room,
          userName: user.userName,
        });
        socketRef.current.on("incomingMousePoints", (data) => {
          console.log(data);
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
      const shareMouseHandler = (x, y) => {
        if (
            Math.abs(shareMouse.mouseX - y) > 10 &&
            Math.abs(shareMouse.mouseY - x) > 10
          ) {
            setShareMouse({mouseX: y, mouseY: x });
            // console.log('22222222');
          socketRef.current.emit("sendMousePoints", {
            user: user.id,
            mouseX: y,
            mouseY: x,
            avatar: user.avatarURL,
            room: message.room,
          });
        }
      };

      const mouseDown = (e) => {
        setline({...line, drawing: true, stroke: color})
      }
      const mouseMove = (e) => {
        if (isShare) {
          console.log('111111111');
          shareMouseHandler(e.evt.clientX, e.evt.clientY)
        }
        if (line.drawing) {
          setline({...line, points: [...line.points, e.evt.clientX, e.evt.clientY]});
        }
      }
      const mouseUp = (e) => {
          setShapes([...shapes, line])
          setline({ points: [], drawing: false})
      }

      const handleNewUserMessage = (data) =>
    socketRef.current.emit("send-message", {
      message: data,
      room: message.room,
      avatar: message.avatar,
    });


      // console.log(shapes);
      // console.log(line);
      // console.log(line.points.toString().length);

  return (
    <>
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

    <Stage
      onMouseDown={mouseDown}
      onMouseMove={mouseMove}
      onMouseUp={mouseUp}
      height={window.innerHeight}
      width={window.innerWidth}
      // draggable={mouseUp ? false : true}
      >
      <Layer>
        {shapes.map( shape => <Line key={uuid()} stroke={shape.stroke} strokeWidth={5} points={shape.points} />)}
        <Line points={line.points} stroke={color} strokeWidth={5} />
      </Layer>
    </Stage>
    <Widget
        handleNewUserMessage={(handleNewUserMessage)}
        // showTimeStamp={false}
        profileAvatar={avatar}
        title={"Chat"}
        display={"inline-block"}
      />
    </>
  );
};

Test.propTypes = {
  color: propTypes.string.isRequired,
  // setShareMouse: propTypes.func.isRequired,
  // shareMouse: propTypes.object.isRequired,
}

export default Test
