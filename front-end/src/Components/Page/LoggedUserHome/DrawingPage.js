import React, { useContext, useEffect, useRef, useState } from "react";
import { Stage, Layer, Line, Rect, Circle, Text } from "react-konva";
import propTypes from "prop-types";
import { v4 as uuid } from "uuid";
import AuthContext from "../../../Providers/Context/AuthContext";
import io from "socket.io-client";
import { Avatar } from "@material-ui/core";
import { Widget, addResponseMessage } from "react-chat-widget";
import DrawEraseWidget from "./DrawEraseWidget";
import ExceptionContext from "../../../Providers/Context/ExceptionContext";
import { BASE_URL, exceptionStatus, isErrorResponse } from "../../../Constants/Constant";
import DrawTextWidget from './DrawTextWidget';
import DrawRectangleWidget from './DrawRectangleWidget';
import DrawCircleWidget from './DrawCircleWidget';
import DrawBrushWidget from './DrawBrushWidget';
import DrawPencilWidget from './DrawPencilWidget';
import TextBoxKonva from './TextBox';
import { withRouter } from 'react-router-dom';
import Chat from './Chat';
// import

const DrawingPage = ({ color, currentWhiteboard, match }) => {
  const { user } = useContext(AuthContext);
  const { setOpen } = useContext(ExceptionContext);
  const socketRef = useRef();
  // const [textInput, setTextInput] = useState({
  //   isOpen: false,
  //   top: 200,
  //   left: 400,
  // })

  const [shape, setShape] = useState({
    line: {
      points: [],
      type: "line",
      startDrawing: false,
      isDrawing: false,
      stroke: "black",
      strokeWidth: 2,
      drawingFunc: (obj) => <Line {...obj} />,
      updateSize: (e, x, y, prev) => {
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
      endDrawing: (prop) => {
        const sendObj = {
          points: prop.points.join(','),
          stroke: prop.stroke,
          strokeWidth: prop.strokeWidth,
        }
        fetch(`${BASE_URL}/whiteboards/${match.params.id}/lines`, {
          method: 'POST',
          headers: {
            Authorization: localStorage.getItem("token"),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(sendObj)
        })
        .then( r => r.json())
        .then( resp => {
          isErrorResponse(resp);
          setShapes((prev) => [...prev, resp]);
          setShape((prev) => ({
          ...shape,
          line: {
            ...prev.line,
            startDrawing: false,
            points: [],
          },
        }));
        })
        .catch( err => setOpen({
          value: true,
          msg: err.message,
          statusType: exceptionStatus.error,
        }))
        // setShape((prev) => ({
        //   ...shape,
        //   line: {
        //     ...prev.line,
        //     startDrawing: false,
        //     points: [],
        //   },
        // }));
      },
      onStartDrawing: (shapeType, color, x, y) =>
        setShape((prev) => ({
          ...prev,
          [shapeType]: {
            ...prev[shapeType],
            startDrawing: true,
            stroke: color,
          },
        })),
        clearDrawingObj: () => setShape((prev) => ({
          ...shape,
          line: {
            ...prev.line,
            startDrawing: false,
            points: [],
          },
        }))
    },
    circle: {
      type: "circle",
      startDrawing: false,
      isDrawing: false,
      stroke: "black",
      fill: "",
      strokeWidth: 1,
      radius: 0,
      drawingFunc: (obj) => <Circle {...obj} />,
      updateSize: (e, x, y, prev) => {
        const differenceX = Math.abs(prev.x - x);
        const differenceY = Math.abs(prev.y - y);
        const newRadius = differenceX > differenceY ? differenceX : differenceY;
        setShape({
          ...shape,
          circle: { ...prev, radius: newRadius },
        });
      },
      endDrawing: (prop) => {
        const sendObj = {
          x: prop.x,
          y: prop.y,
          fill: prop.fill,
          radius: prop.radius,
          stroke: prop.stroke,
          strokeWidth: prop.strokeWidth,
        }
        fetch(`${BASE_URL}/whiteboards/${match.params.id}/circles`, {
          method: 'POST',
          headers: {
            Authorization: localStorage.getItem("token"),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(sendObj)
        })
        .then( r => r.json())
        .then( resp => {
          isErrorResponse(resp);
          setShapes((prev) => [...prev, resp]);
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
        })
        .catch( err => setOpen({
          value: true,
          msg: err.message,
          statusType: exceptionStatus.error,
        }))

      },
      onStartDrawing: (shapeType, color, x, y) =>
        setShape((prev) => ({
          ...prev,
          [shapeType]: {
            ...prev[shapeType],
            startDrawing: true,
            stroke: color,
            fill: (prev[shapeType].fill.length !== 0 ? color : ""),
            x,
            y,
            radius: 10,
          },
        })),
        clearDrawingObj: () => setShape((prev) => ({
          ...shape,
          circle: {
            ...prev.circle,
            startDrawing: false,
            x: 0,
            y: 0,
            radius: 0,
          },
        }))
    },
    rectangle: {
      type: "rectangle",
      startDrawing: false,
      isDrawing: false,
      stroke: "black",
      strokeWidth: 1,
      fill: "",
      height: 0,
      width: 0,
      drawingFunc: (obj) => <Rect {...obj} />,
      updateSize: (e, x, y, prev) => {
        setShape({
          ...shape,
          rectangle: { ...prev, width: x - prev.x, height: y - prev.y },
        });
      },
      endDrawing: (prop) => {
        const sendObj = {
          x: prop.x,
          y: prop.y,
          fill: prop.fill,
          height: prop.height,
          width: prop.width,
          stroke: prop.stroke,
          strokeWidth: prop.strokeWidth,
        }
        fetch(`${BASE_URL}/whiteboards/${match.params.id}/rectangles`, {
          method: 'POST',
          headers: {
            Authorization: localStorage.getItem("token"),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(sendObj)
        })
        .then( r => r.json())
        .then( resp => {
          isErrorResponse(resp);
          console.log(shapes.length);
          setShapes((prev) => [...prev, resp]);
          console.log(shapes.length);
          setShape((prev) => ({
          ...shape,
          rectangle: {
            ...prev.rectangle,
            startDrawing: false,
            x: 0,
            y: 0,
            height: 0,
            width: 0,
          },
        }));
        })
        .catch( err => setOpen({
          value: true,
          msg: err.message,
          statusType: exceptionStatus.error,
        }))

      },
      onStartDrawing: (shapeType, color, x, y) =>
        setShape((prev) => ({
          ...prev,
          [shapeType]: {
            ...prev[shapeType],
            startDrawing: true,
            stroke: color,
            fill: (prev[shapeType].fill.length !== 0 ? color : ""),
            x,
            y,
            height: 10,
            width: 10,
          },
        })),
        clearDrawingObj: () => setShape((prev) => ({
          ...shape,
          rectangle: {
            ...prev.rectangle,
            startDrawing: false,
            x: 0,
            y: 0,
            height: 0,
            width: 0,
          },
        }))
    },
    textBox: {
      type: "textBox",
      startDrawing: false,
      isDrawing: false,
      text: "",
      fontSize: 20,
      fontStyle: "normal",
      fill: "black",
      // height: 300,
      // width: 300,
      textDecoration: '',
      drawingFunc: (obj) => <Text {...obj} />,
      updateSize: (prop, value) => {
        setShape(prev => ({
          ...shape,
          textBox: { ...prev.textBox, [prop]: value },
        }));
      },
      endDrawing: (prop) => {
        const sendObj = {
          x: prop.x,
          y: prop.y,
          fill: prop.fill,
          text: prop.text,
          fontStyle: prop.fontStyle,
          fontSize: prop.fontSize,
          textDecoration: prop.textDecoration,
        }
        fetch(`${BASE_URL}/whiteboards/${match.params.id}/texts`, {
          method: 'POST',
          headers: {
            Authorization: localStorage.getItem("token"),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(sendObj)
        })
        .then( r => r.json())
        .then( resp => {
          isErrorResponse(resp);
          setShapes((prev) => [...prev, resp]);
          setShape((prev) => ({
          ...shape,
          textBox: {
            ...prev.textBox,
            startDrawing: false,
            text: "",
          },
        }));
        })
        .catch( err => setOpen({
          value: true,
          msg: err.message,
          statusType: exceptionStatus.error,
        }))

      },
      onStartDrawing: (shapeType, color, x, y) =>
        setShape((prev) => ({
          ...prev,
          [shapeType]: {
            ...prev[shapeType],
            startDrawing: true,
            text: "",
            fontSize: 40,
            fill: color,
            x,
            y,
            // height: 10,
            // width: 10,
          },
        })),
      clearDrawingObj: () => setShape((prev) => ({
        ...shape,
        textBox: {
          ...prev.textBox,
          startDrawing: false,
          text: "",
        },
      }))
    },
  }); // for add new shape need only to add property obj here !!!

  const [shapes, setShapes] = useState(Object.keys(currentWhiteboard).reduce((acc, value) => {
    if (typeof currentWhiteboard[value] === 'object') {
      return [...acc, ...currentWhiteboard[value]]
    }
    return acc
  }, []));
  // const [shapes, setShapes] = useState(
  //   Object.keys(currentWhiteboard).reduce((acc, value) => {
  //     if (value === "circle") {
  //       return [...acc, ...currentWhiteboard[value]];
  //     }
  //     return acc;
  //   }, [])
  // );
  const [avatar, setAvatar] = useState("");
  const [sharedUsers, setSharedUsers] = useState([]);
  const [shareMouse, setShareMouse] = useState({
    isShare: false,
    mouseX: 0,
    mouseY: 0,
  });

  useEffect(() => {
    socketRef.current = io("http://localhost:3000/collaboration");

    // socketRef.current.on("come-message", (incomingMsg) => {
    //   setAvatar(
    //     "https://cnet2.cbsistatic.com/img/liJ9UZA87zs1viJiuEfVnL7YYfw=/940x0/2020/05/18/5bac8cc1-4bd5-4496-a8c3-66a6cd12d0cb/fb-avatar-2.jpg"
    //   );
    //   addResponseMessage(incomingMsg.message);
    // });
    // socketRef.current.on("joinedToRoom", (data) => {
    //   addResponseMessage(data);
    // });

    if (currentWhiteboard && user) {
      socketRef.current.emit("joinRoom", {
        room: currentWhiteboard.id,
        userName: user.userName,
      });
    }
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

  const updateShapeProp = (shapeType, prop, token = false) => {
    if (token) {
      Object.keys(shape)
      .filter((y) => y !== shapeType)
      .map((x) => (shape[x].isDrawing = false));
    }
    setShape(prev => ({
      ...prev,                                    // update funk with setIsDrawing funk
      [shapeType]: {
        ...prev[shapeType],
        ...prop,
        // [prop]: value,
      }
    }))
  }

  const shareMouseHandler = (x, y) => {
    setShareMouse({ isShare: true, mouseX: y, mouseY: x });
    socketRef.current.emit("sendMousePoints", {
      user: user.id,
      mouseX: y,
      mouseY: x,
      avatar: user.avatarURL,
      room: currentWhiteboard.id,
    });
  };

  const mouseDown = (e, x, y) => {
    const shapeType = Object.keys(shape).find((x) => shape[x].isDrawing);
    if (shapeType) {
      shape[shapeType].onStartDrawing(shapeType, color, x, y);
      // fetch(sgaaeh)

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

  const mouseMove = (e, x, y) => {
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
      if (shapeType !== 'textBox') {
        shape[shapeType].updateSize(e, x, y, shape[shapeType]);
      }

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
      if (shapeType !== 'textBox') {
        if (user) {
          shape[shapeType].endDrawing(shape[shapeType]);
        } else {
          setShapes([...shapes, shape[shapeType]]);
          shape[shapeType].clearDrawingObj();
        }
      }

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

  // const setIsDrawing = (prop) => {
  //   Object.keys(shape)
  //     .filter((y) => y !== prop)
  //     .map((x) => (shape[x].isDrawing = false));
  //   setShape({
  //     ...shape,
  //     [prop]: {
  //       ...shape[prop],
  //       isDrawing: !shape[prop].isDrawing,
  //     },
  //   });
  // };

  const handleNewUserMessage = (data) =>
    socketRef.current.emit("send-message", {
      message: data,
      room: currentWhiteboard.id,
      avatar: user.avatar,
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

  return (
    <React.Fragment>
      <Stage
        onMouseDown={(e) => mouseDown(e, e.evt.offsetX, e.evt.offsetY)}
        onMouseMove={(e) => mouseMove(e, e.evt.offsetX, e.evt.offsetY)}
        onMouseUp={(e) => mouseUp(e)}
        height={window.innerHeight}
        width={window.innerWidth}
        // draggable={mouseUp ? false : true}
      >
        <Layer>
          {shapes.length !== 0
            ? shapes.map((x) => shape[x.type].drawingFunc(x))
            : null}
            {/* <Circle position={3}
            radius={100}
            stroke="black"
            fill="red"
            strokeWidth={5}
            type="circle"
            x={372}
            y={436} /> */}
            {/* {shape['circle'].drawingFunc({position:3,
            radius:10,
            stroke:"black",
            strokeWidth:5,
            type:"circle",
            x:372,
            y:436},)} */}

          {/* {shapes.length !== 0
            ? shapes.map((shape) => <Line key={uuid()} {...shape} />)
            : null} */}
          {/* <Rect
            x={300}
            y={400}
            height={100}
            width={100}
            stroke="black"
            strokeWidth={5}
            fill={"red"}
          />
          <Text
            text={"Nice man your are the best"}
            x={400}
            y={500}
            fill={"red"}
            draggable
            fontSize={40}
          /> */}
          {renderSingleDrawingElement()}
        </Layer>
      </Stage>
      {/* { user ? <Widget
        handleNewUserMessage={handleNewUserMessage}
        // showTimeStamp={false}
        profileAvatar={avatar}
        title={"Chat"}
        display={"inline-block"}
      /> : null } */}
      {currentWhiteboard ? <Chat currentWhiteboard={currentWhiteboard} /> : null}
      <TextBoxKonva shapeTextBox={shape.textBox} setShapes={setShapes} />
      {/* <Chat socketRef={socketRef} /> */}
      <div style={{position: 'fixed'}}>
      <DrawEraseWidget shareHandler={shareHandler} updateShapeProp={updateShapeProp} color={color} />
      <DrawTextWidget shareHandler={shareHandler} updateShapeProp={updateShapeProp} color={color} />
      <DrawRectangleWidget shareHandler={shareHandler} updateShapeProp={updateShapeProp} color={color} />
      <DrawCircleWidget shareHandler={shareHandler} updateShapeProp={updateShapeProp} color={color} />
      <DrawBrushWidget shareHandler={shareHandler} updateShapeProp={updateShapeProp} color={color} />
      <DrawPencilWidget shareHandler={shareHandler} updateShapeProp={updateShapeProp} color={color} />
      </div>
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
    </React.Fragment>
  );
};

DrawingPage.propTypes = {
  color: propTypes.string.isRequired,
  // setShareMouse: propTypes.func.isRequired,
  // shareMouse: propTypes.object.isRequired,
};

export default withRouter(DrawingPage);
