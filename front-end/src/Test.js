import React, { useContext, useEffect, useRef, useState } from "react";
import { Stage, Layer, Line, Rect, Circle } from "react-konva";
import propTypes from "prop-types";
import { v4 as uuid } from "uuid";
import AuthContext from "./Providers/Context/AuthContext";
import io from "socket.io-client";
import { Avatar } from "@material-ui/core";
import { Widget, addResponseMessage } from "react-chat-widget";
import DrawWidget from "./Components/Page/LoggedUserHome/DrawWidget";
import ExceptionContext from "./Providers/Context/ExceptionContext";
import { exceptionStatus } from "./Constants/Constant";
import DrawWidget1 from './Components/Page/LoggedUserHome/DrawWidget1';
// import

const Test = ({ color, stroke1, currentWhiteboard }) => {
  const { user } = useContext(AuthContext);
  const { setOpen } = useContext(ExceptionContext);
  const socketRef = useRef();

  const [shape, setShape] = useState({
    line: {
      points: [],
      type: "line",
      startDrawing: false,
      isDrawing: false,
      stroke: "black",
      color: color,
      strokeWidth: stroke1,
      drawingFunc: (obj) => <Line {...obj} />,
      updateSize: (x, y, prev) => {
        if (prev.points.length !== 0) {
          if (prev.points.toString().length > 4000) {
            setOpen({
              value: true,
              msg: "To long element, try to use drawing gadgets!",
              statusType: exceptionStatus.warning,
            });
            mouseUp();
          } else {
            if (
              Math.abs(prev.points[prev.points.length - 1] - y) > 5 ||
              Math.abs(prev.points[prev.points.length - 2] - x) > 5
            ) {
              setShape({
                ...shape,
                line: { ...prev, points: [...prev.points, x, y] },
              });
            }
          }
        } else {
          setShape({
            ...shape,
            line: { ...prev, points: [...prev.points, x, y] },
          });
        }
      },
      endDrawing: () => {
        setShape((prev) => ({
          ...shape,
          line: {
            ...prev.line,
            startDrawing: false,
            points: [],
          },
        }));
      },
      onStartDrawing: (shapeType) => setShape(prev => ({
        ...prev,
        [shapeType]: {
          ...prev[shapeType],
          startDrawing: true,
          stroke: color,
          strokeWidth: stroke1,
          position: shapes.length + 1,

        },
      }))
    },
    circle: {
      type: "circle",
      startDrawing: false,
      isDrawing: false,
      stroke: "black",
      color: color,
      strokeWidth: stroke1,
      radius: 0,
      drawingFunc: (obj) => <Circle {...obj} />,
      updateSize: (x, y, prev) => {
        setShape({
          ...shape,
          circle: { ...prev, radius: Math.abs(prev.x - x) },
        });
      },
      endDrawing: () => {
        setShape((prev) => ({
          ...shape,
          circle: {
            ...prev.circle,
            startDrawing: false,
            x: 0,
            y: 0,
            radius: 0,
          },
        }));
      },
      onStartDrawing: (shapeType, x, y) => setShape(prev => ({
        ...prev,
        [shapeType]: {
          ...prev[shapeType],
          startDrawing: true,
          stroke: color,
          strokeWidth: stroke1,
          position: shapes.length + 1,
          x,
          y,
          radius: 10
        },
      }))
    },
  }); // for add new shape need only to add property obj here !!!

  // const [shapes, setShapes] = useState(Object.keys(currentWhiteboard).reduce((acc, value) => {
  //   if (typeof currentWhiteboard[value] === 'object') {
  //     return [...acc, ...currentWhiteboard[value]]
  //   }
  //   return acc
  // }, []));
  const [shapes, setShapes] = useState(
    Object.keys(currentWhiteboard).reduce((acc, value) => {
      if (value === "lines") {
        return [...acc, ...currentWhiteboard[value]];
      }
      return acc;
    }, [])
  );
  const [message, setMessage] = useState({
    room: user.email,
    from: user.id,
    avatar: user.avatarURL,
  });
  const [avatar, setAvatar] = useState("");
  const [sharedUsers, setSharedUsers] = useState([]);
  const [shareMouse, setShareMouse] = useState({
    isShare: false,
    mouseX: 0,
    mouseY: 0,
  });

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
    setShareMouse({ isShare: true, mouseX: y, mouseY: x });
    socketRef.current.emit("sendMousePoints", {
      user: user.id,
      mouseX: y,
      mouseY: x,
      avatar: user.avatarURL,
      room: message.room,
    });
  };

  const mouseDown = (x, y) => {
    const shapeType = Object.keys(shape).find((x) => shape[x].isDrawing);
    if (shapeType) {
      shape[shapeType].onStartDrawing(shapeType, x, y)

      // setShape({
      //   ...shape,
      //   [shapeType]: {
      //     ...shape[shapeType],
      //     startDrawing: true,
      //     stroke: color,
      //     strokeWidth: stroke1,
      //     position: shapes.length + 1,

      //   },
      // });
    }
  };
  const mouseMove = (x, y) => {
    if (shareMouse.isShare) {
      if (
        Math.abs(shareMouse.mouseX - y) > 10 ||
        Math.abs(shareMouse.mouseY - x) > 10
      ) {
        shareMouseHandler(x, y);
      }
    }
    const shapeType = Object.keys(shape).find(
      (x) => shape[x].isDrawing && shape[x].startDrawing
    );
    if (shapeType) {
      shape[shapeType].updateSize(x, y, shape[shapeType]);
      // setShape({
      //   ...shape,
      //   [shapeType]: {
      //     ...shape[shapeType],
      //     points: [...shape[shapeType].points, x, y],
      //   },
      // });
    }
  };
  const mouseUp = (e) => {
    const shapeType = Object.keys(shape).find(
      (x) => shape[x].isDrawing && shape[x].startDrawing
    );
    if (shapeType) {
      setShapes([...shapes, shape[shapeType]]);
      shape[shapeType].endDrawing();
      // setShape({
      //   ...shape,
      //   [shapeType]: {
      //     ...shape[shapeType],
      //     startDrawing: false,
      //     points: [],
      //   },
      // });
    }
  };

  const setIsDrawing = (prop) => {
    setShape({
      ...shape,
      [prop]: {
        ...shape[prop],
        isDrawing: !shape[prop].isDrawing,
      },
    });
  };

  const handleNewUserMessage = (data) =>
    socketRef.current.emit("send-message", {
      message: data,
      room: message.room,
      avatar: message.avatar,
    });

  // const drawingLine = (obj) => <Line {...obj} />

  const shareHandler = (e) =>
    setShareMouse({ ...shareMouse, isShare: !shareMouse.isShare });

  const renderSingleDrawingElement = () => {
    const shapeType = Object.keys(shape).find(
      (x) => shape[x].isDrawing && shape[x].isDrawing
    );
    return shape[shapeType]
      ? shape[shapeType].drawingFunc(shape[shapeType])
      : null;
  };

  console.log(shape.circle);

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
        onMouseDown={(e) => mouseDown(e.evt.offsetX, e.evt.offsetY)}
        onMouseMove={(e) => mouseMove(e.evt.offsetX, e.evt.offsetY)}
        onMouseUp={(e) => mouseUp(e)}
        height={window.innerHeight}
        width={window.innerWidth}
        // draggable={mouseUp ? false : true}
      >
        <Layer>
          {shapes.length !== 0
            ? shapes.map((x) =>
                shape[x.type].drawingFunc({ ...x, key: uuid() })
              )
            : null}
          {/* {shapes.length !== 0
            ? shapes.map((shape) => <Line key={uuid()} {...shape} />)
            : null} */}
            <Circle x={300} y={400} radius={40} stroke='black' strokeWidth={5} fill={'red'} />
          {renderSingleDrawingElement()}
        </Layer>
      </Stage>
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        // showTimeStamp={false}
        profileAvatar={avatar}
        title={"Chat"}
        display={"inline-block"}
      />
      {/* <Chat socketRef={socketRef} /> */}
      <div style={{position: 'fixed'}}>
      <DrawWidget shareHandler={shareHandler} setIsDrawing={setIsDrawing} />
      <DrawWidget1 shareHandler={shareHandler} setIsDrawing={setIsDrawing} />
      </div>
    </>
  );
};

Test.propTypes = {
  color: propTypes.string.isRequired,
  // setShareMouse: propTypes.func.isRequired,
  // shareMouse: propTypes.object.isRequired,
};

export default Test;
