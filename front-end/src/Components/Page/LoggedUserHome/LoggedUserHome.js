import React, { useContext, useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/Notifications";
import ExitToApp from "@material-ui/icons/ExitToApp";
import {
  ListItemAvatar,
  Avatar,
  IconButton,
  ListItem,
} from "@material-ui/core";
import AuthContext from "../../../Providers/Context/AuthContext";
import { logOutHandler, BASE_URL } from "../../../Constants/Constant";
import { Widget, addResponseMessage } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import io from "socket.io-client";
import Test from "../../../Test";
import Next from "@material-ui/icons/NavigateNext";
import Before from "@material-ui/icons/NavigateBefore";
import ProfileMenu from "./ProfileMenu";
import DrawWidget from "./DrawWidget";
import "./chat.css";
import { SketchPicker } from "react-color";

const LoggedUserHomePage = ({ history }) => {
  const { user, setUser } = useContext(AuthContext);

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
    },
    toolbar: {
      paddingRight: 24,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    title: {
      flexGrow: 1,
    },
  }));

  const classes = useStyles();

  const [avatar, setAvatar] = useState("");
  const [anchorEl, setAnchorEl] = useState(false);
  const [color, setColor] = useState("black");
  const [shareMouse, setShareMouse] = useState({
    isShare: false,
    mouseX: 0,
    mouseY: 0,
  });

  const [message, setMessage] = useState({
    message: "",
    room: user.email,
    from: user.id,
    avatar: user.avatarURL,
  });

  const [sharedUsers, setSharedUsers] = useState([
    {
      id: "",
      avatar: "string",
      mouseX: 0,
      mouseY: 0,
    },
  ]);

  const socketRef = useRef();
  socketRef.current = io("http://localhost:3000/chat");
  useEffect(() => {
    // if (shareMouse.isShare) {
    //   socketRef.current.emit("sendMousePoints", {
    //     user: user.id,
    //     mouseX: shareMouse.mousePositionX,
    //     mouseY: shareMouse.mousePositionY,
    //     avatar: user.avatarURL,
    //     room: message.room,
    //   })
    // }

    socketRef.current.on("incomingMousePoints", (data) => {
      console.log(data);
      // const user = sharedUsers.find( x => x.id === data.userId);
      if (true) {
        setSharedUsers([
          {
            ...sharedUsers[0],
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

    socketRef.current.emit("joinRoom", {
      room: message.room,
      userName: user.userName,
    });
    socketRef.current.on("joinedToRoom", (data) => {
      addResponseMessage(data);
    });
    socketRef.current.on("leftRoom", (data) => {
      addResponseMessage(data);
    });
    socketRef.current.on("come-message", (incomingMsg) => {
      setAvatar(
        "https://cnet2.cbsistatic.com/img/liJ9UZA87zs1viJiuEfVnL7YYfw=/940x0/2020/05/18/5bac8cc1-4bd5-4496-a8c3-66a6cd12d0cb/fb-avatar-2.jpg"
      );
      addResponseMessage(incomingMsg.message);
    });
  }, []);

  const handleNewUserMessage = (data) =>
    socketRef.current.emit("send-message", {
      message: data,
      room: message.room,
      from: message.from,
      avatar: message.avatar,
    });

  const handleClickProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseProfile = () => {
    setAnchorEl(false);
  };

  const shareMouseHandler = (e) => {
    const moveX = e.clientY;
    const moveY = e.clientX;
    if (
      shareMouse.isShare &&
      Math.abs(shareMouse.mouseX - moveX) > 20 &&
      Math.abs(shareMouse.mouseY - moveY) > 20
    ) {
      setShareMouse({
        isShare: true,
        mouseX: moveX,
        mouseY:moveY,
      });

      socketRef.current.emit("sendMousePoints", {
        user: user.id,
        mouseX: shareMouse.mouseX,
        mouseY: shareMouse.mouseY,
        avatar: user.avatarURL,
        room: message.room,
      });
    }
  };

  return (
    <div className={classes.root} onMouseMove={shareMouseHandler}>
      <CssBaseline />
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          {/* <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(
                classes.menuButton,
                open && classes.menuButtonHidden
              )}
            >
              <MenuIcon />
            </IconButton> */}
          <ListItemAvatar>
            <Avatar
              src={`${BASE_URL}/${user.avatarURL}`}
              alt={user.userName}
              style={{ cursor: "pointer" }}
              onClick={handleClickProfile}
            />
          </ListItemAvatar>
          <span style={{ fontSize: "25px" }}>{user.userName}</span>
          <ProfileMenu anchorEl={anchorEl} handleClose={handleCloseProfile} />
          <ListItem style={{ justifyContent: "center" }}>
            <IconButton>
              <Before />
            </IconButton>
            <span style={{ fontSize: "20px" }}>sdfdsfgadf</span>
            <IconButton>
              <Next />
            </IconButton>
          </ListItem>
          <span style={{ paddingRight: "10px", fontSize: "20px" }}>Logout</span>
          <ExitToApp
            style={{ cursor: "pointer" }}
            color="inherit"
            onClick={(e) => (
              e.preventDefault(), logOutHandler(setUser, history)
            )}
          >
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </ExitToApp>
        </Toolbar>
      </AppBar>
      <Test color={color} />

      <Avatar
        src={"https://image.flaticon.com/icons/png/512/32/32117.png"}
        alt={"df"}
        style={{
          position: "absolute",
          top: sharedUsers[0].mouseX,
          left: sharedUsers[0].mouseY,
        }}
      />

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
        style={{ backgroundColor: "red" }}
      />
      <DrawWidget />
    </div>
  );
};
export default LoggedUserHomePage;
