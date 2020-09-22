import React, { useContext, useEffect, useRef, useState } from "react";
import { Stage, Layer, Line, Rect, Circle, Text } from "react-konva";
import propTypes from "prop-types";
import { v4 as uuid } from "uuid";
import AuthContext from "../../../Providers/Context/AuthContext";
import io from "socket.io-client";
import { Avatar } from "@material-ui/core";
import { Widget, addResponseMessage } from "react-chat-widget";
import DrawExtrasWidget from "./DrawExtrasWidget";
import ExceptionContext from "../../../Providers/Context/ExceptionContext";
import { BASE_URL, exceptionStatus, isErrorResponse } from "../../../Constants/Constant";
import DrawTextWidget from './DrawTextWidget';
import DrawRectangleWidget from './DrawRectangleWidget';
import DrawCircleWidget from './DrawCircleWidget';
import DrawBrushWidget from './DrawBrushWidget';
import DrawPencilWidget from './DrawPencilWidget';
import TextBoxKonva from './TextBox';
import { withRouter } from 'react-router-dom';
import { Undo } from '@material-ui/icons';
import DrawEraserWidget from './DrawEraserWidget';
// import Chat from './Chat';
// import

const DrawingPage = ({
  color,
  currentWhiteboard,
  match,
  shareMouse,
  setShareMouse,
  sharedUsers,
  shareMouseHandler,
  location,
  undo,
  history,
  redo,
  isShareMouse,
}) => {
  const { user } = useContext(AuthContext);
  const { setOpen } = useContext(ExceptionContext);
  const [isErase, setIsErase] = useState(false);
  const [strokeWidth, setStrokeWidth] = useState(1);
  // const [fontSize, setFontSize] = useState(12);

  const [shape, setShape] = useState({
    lines: {
      points: [],
      type: "lines",
      startDrawing: false,
      isDrawing: false,
      stroke: "black",
      strokeWidth : strokeWidth,
      drawingFunc: (obj) => <Line {...obj} />,
      updateSize: (e, x, y, prev) => {
        if (prev.points.length !== 0) {
          if (prev.points.toString().length > 4000) {
            setOpen({
              value: true,
              msg: "Maximum line complexity reached. Please use another tool.",
              statusType: exceptionStatus.warning,
            });
            mouseUp();
          } else {
            if (
              Math.abs(prev.points[prev.points.length - 1] - y) > 5 ||
              Math.abs(prev.points[prev.points.length - 2] - x) > 5
            ) {
              setShape( pre => ({
                ...pre,
                lines: { ...pre.lines, points: [...pre.lines.points, x, y] },
              }));
            }
          }
        } else {
          setShape(pre => ({
            ...pre,
            lines: { ...pre.lines, points: [...pre.lines.points, x, y] },
          }));
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
          lines: {
            ...prev.lines,
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
      },
      onStartDrawing: (shapeType, color, x, y, strokeWidth) =>
        setShape((prev) => ({
          ...prev,
          [shapeType]: {
            ...prev[shapeType],
            startDrawing: true,
            stroke: color,
            strokeWidth: strokeWidth,
          },
        })),
        clearDrawingObj: () => setShape((prev) => ({
          ...shape,
          lines: {
            ...prev.lines,
            startDrawing: false,
            points: [],
          },
        }))
    },
    circles: {
      type: "circles",
      startDrawing: false,
      isDrawing: false,
      stroke: "black",
      fill: "",
      strokeWidth: strokeWidth,
      radius: 0,
      drawingFunc: (obj) => <Circle {...obj} />,
      updateSize: (e, x, y, prev) => {
        const differenceX = Math.abs(prev.x - x);
        const differenceY = Math.abs(prev.y - y);
        const newRadius = differenceX > differenceY ? differenceX : differenceY;
        setShape({
          ...shape,
          circles: { ...prev, radius: newRadius },
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
          circles: {
            ...prev.circles,
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
      onStartDrawing: (shapeType, color, x, y, strokeWidth) =>
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
            strokeWidth,
          },
        })),
        clearDrawingObj: () => setShape((prev) => ({
          ...shape,
          circles: {
            ...prev.circles,
            startDrawing: false,
            x: 0,
            y: 0,
            radius: 0,
          },
        }))
    },
    rectangles: {
      type: "rectangles",
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
          rectangles: { ...prev, width: x - prev.x, height: y - prev.y },
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
          setShapes((prev) => [...prev, resp]);
          setShape((prev) => ({
          ...shape,
          rectangles: {
            ...prev.rectangles,
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
      onStartDrawing: (shapeType, color, x, y, strokeWidth) =>
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
            strokeWidth,
          },
        })),
        clearDrawingObj: () => setShape((prev) => ({
          ...shape,
          rectangles: {
            ...prev.rectangles,
            startDrawing: false,
            x: 0,
            y: 0,
            height: 0,
            width: 0,
          },
        }))
    },
    textBoxes: {
      type: "textBoxes",
      startDrawing: false,
      isDrawing: false,
      text: "",
      fontSize: 12,
      fontStyle: "normal",
      fill: "black",
      textDecoration: '',
      drawingFunc: (obj) => <Text {...obj} />,
      updateSize: (prop, value) => {
        setShape(prev => ({
          ...shape,
          textBoxes: { ...prev.textBoxes, [prop]: value },
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
        fetch(`${BASE_URL}/whiteboards/${match.params.id}/textBoxes`, {
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
          textBoxes: {
            ...prev.textBoxes,
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
      onStartDrawing: (shapeType, color, x, y) => {
      // console.log(`from onStart ${fontSize}`)
        setShape((prev) => ({
          ...prev,
          [shapeType]: {
            ...prev[shapeType],
            startDrawing: true,
            text: "",
            // fontSize: fontSize,
            fill: color,
            x,
            y,
            // height: 10,
            // width: 10,
          },
        }))},
      clearDrawingObj: () => setShape((prev) => ({
        ...shape,
        textBoxes: {
          ...prev.textBoxes,
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
  }, []).sort((a, b) => a.itemPosition - b.itemPosition));

  // console.log(shape.lines);
  useEffect(() => {
    if (location.pathname.includes('undo')) {
      undo(shapes, history)
    } else if (location.pathname.includes('redo')) {
      redo(setShapes, history)
    } else {
      return
    }
  }, [location.pathname])

  // useEffect(() => {
  //   socketRef.current = io("http://localhost:3000/chat");

  //   // socketRef.current.on("come-message", (incomingMsg) => {
  //   //   setAvatar(
  //   //     "https://cnet2.cbsistatic.com/img/liJ9UZA87zs1viJiuEfVnL7YYfw=/940x0/2020/05/18/5bac8cc1-4bd5-4496-a8c3-66a6cd12d0cb/fb-avatar-2.jpg"
  //   //   );
  //   //   addResponseMessage(incomingMsg.message);
  //   // });
  //   // socketRef.current.on("joinedToRoom", (data) => {
  //   //   addResponseMessage(data);
  //   // });

  //   // if (currentWhiteboard && user) {
  //   //   socketRef.current.emit("joinRoom", {
  //   //     room: currentWhiteboard.id,
  //   //     userName: user.userName,
  //   //   });
  //   // }
  //   socketRef.current.on("incomingMousePoints", (data) => {
  //     const user = sharedUsers.find((x) => x.id === data.userId);
  //     if (user) {
  //       setSharedUsers([
  //         ...sharedUsers,
  //         {
  //           ...user,
  //           mouseX: data.mouseX,
  //           mouseY: data.mouseY,
  //         },
  //       ]);
  //     } else {
  //       setSharedUsers([
  //         ...sharedUsers,
  //         {
  //           id: data.id,
  //           avatar: data.avatar,
  //           mouseX: data.mouseX,
  //           mouseY: data.mouseY,
  //         },
  //       ]);
  //     }
  //   });
  // }, []);

  const updateShapeProp = (shapeType, prop, token = false, erase = true) => {
    if (token) {
      Object.keys(shape)
      .filter((y) => y !== shapeType)
      .map((x) => (shape[x].isDrawing = false));
    }

    if (erase) {
      setIsErase(false)
    }

    setShape(prev => ({
      ...prev,                                    // update funk with setIsDrawing funk
      [shapeType]: {
        ...prev[shapeType],
        ...prop,
        // [prop]: value,
      }
    }));

  }

  // const shareMouseHandler = (x, y) => {
  //   setShareMouse({ isShare: true, mouseX: y, mouseY: x });
  //   socketRef.current.emit("sendMousePoints", {
  //     user: user.id,
  //     mouseX: y,
  //     mouseY: x,
  //     avatar: user.avatarURL,
  //     room: currentWhiteboard.id,
  //   });
  // };
  const mouseDown = (e, x, y) => {
    const shapeType = Object.keys(shape).find((x) => shape[x].isDrawing);
    if (shapeType) {
      if (shapeType === 'lines' && isErase) {
        shape[shapeType].onStartDrawing(shapeType, '#fafafa', x, y, strokeWidth);
      } else {
        // console.log(fontSize);
        shape[shapeType].onStartDrawing(shapeType, color, x, y, strokeWidth);
      }
    }
  };

  // console.log(isErase);

  const mouseMove = (e, x, y) => {
    if (isShareMouse) {
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
      if (shapeType !== 'textBoxes') {
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
      if (shapeType !== 'textBoxes') {
        if (user) {
          shape[shapeType].endDrawing(shape[shapeType]);
        } else {
          setShapes([...shapes, shape[shapeType]]);
          shape[shapeType].clearDrawingObj();
        }
      }
    }
  };

  // const shareHandler = (e) =>
  //   setShareMouse({ ...shareMouse, isShare: !shareMouse.isShare });

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
        draggable={mouseUp ? false : true}
      >
        <Layer>
          {shapes.length !== 0
            ? shapes.sort((a, b) => a.itemPosition - b.itemPosition).map((x) => shape[x.type].drawingFunc(x))
            : null}
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
      {/* {currentWhiteboard ? <Chat currentWhiteboard={currentWhiteboard} /> : null} */}
      <TextBoxKonva shapeTextBoxes={shape.textBoxes} setShapes={setShapes} color={color} />
      {/* <Chat socketRef={socketRef} /> */}
      <div style={{position: 'fixed'}}>
      {/* <DrawExtrasWidget updateShapeProp={updateShapeProp} color={color} /> */}
      <DrawTextWidget updateShapeProp={updateShapeProp} color={color} />
      <DrawRectangleWidget updateShapeProp={updateShapeProp} color={color} />
      <DrawCircleWidget updateShapeProp={updateShapeProp} color={color} />
      <DrawBrushWidget updateShapeProp={updateShapeProp} color={color} />
      <DrawPencilWidget setStrokeWidth={setStrokeWidth} updateShapeProp={updateShapeProp} color={color} strokeWidth={strokeWidth} />
      <DrawEraserWidget setIsErase={setIsErase} updateShapeProp={updateShapeProp} strokeWidth={strokeWidth} />
      </div>
      {!location.pathname.includes('guest') && sharedUsers.length !== 0
        ? sharedUsers.map((user) => (
            <Avatar
              key={user.id}
              src={user.avatar}
              alt={`${user.userName}`}
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
