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
import {
  logOutHandler,
  BASE_URL,
  isErrorResponse,
  exceptionStatus,
} from "../../../Constants/Constant";
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
import pointer from "./pointer.jpg";
import LoadingContext from "../../../Providers/Context/LoadingContext";
import ExceptionContext from "../../../Providers/Context/ExceptionContext";
import Loading from "../Loading/Loading";
import SearchWhiteBoards from './SearchWhiteBoards';

const LoggedUserHomePage = ({ history, match }) => {
  const { user, setUser } = useContext(AuthContext);
  const { loading, setLoading } = useContext(LoadingContext);
  const { setOpen } = useContext(ExceptionContext);
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

  const socketRef = useRef();

  const classes = useStyles();

  const [avatar, setAvatar] = useState("");
  const [anchorEl, setAnchorEl] = useState(false);
  const [color, setColor] = useState("black");

  const [shareMouse, setShareMouse] = useState({
    isShare: false,
    mouseX: 0,
    mouseY: 0,
  });
  const [currentWhiteboard, setCurrentWhiteboard] = useState({
    id: "",
    author: "",
    circles: [],
    rectangles: [],
    lines: [],
    textBoxes: [],
    name: "",
    isPublic: false,
  });
  const [message, setMessage] = useState({
    room: user.email,
    from: user.id,
    avatar: user.avatarURL,
  });
  const [sharedUsers, setSharedUsers] = useState([]);
  const [whiteboards, setWhiteboards] = useState([]);
  const [activeWhiteboards, setActiveWhiteboards] = useState([]);
  const [isSearchBoard, setIsSearchBoard] = useState(false);


  // console.log(match);
  // console.log(currentWhiteboard);
  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/whiteboards/${match.params.id}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((r) => r.json())
      .then((resp) => {
        isErrorResponse(resp);
        console.log(resp);
        setCurrentWhiteboard(resp);
        setActiveWhiteboards([...activeWhiteboards, resp]);
      })
      .catch((err) =>
        setOpen({
          value: true,
          msg: err.message,
          statusType: exceptionStatus.error,
        })
      )
      .finally(() => setLoading(false));
  }, [match.params.id]);

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

  const handleNewUserMessage = (data) =>
    socketRef.current.emit("send-message", {
      message: data,
      room: message.room,
      avatar: message.avatar,
    });

  const handleClickProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseProfile = () => {
    setAnchorEl(false);
  };

  const shareMouseHandler = (x, y) => {
    if (
      Math.abs(shareMouse.mouseX - y) > 10 &&
      Math.abs(shareMouse.mouseY - x) > 10
    ) {
      setShareMouse({ ...shareMouse, mouseX: y, mouseY: x });
      socketRef.current.emit("sendMousePoints", {
        user: user.id,
        mouseX: y,
        mouseY: x,
        avatar: user.avatarURL,
        room: message.room,
      });
    }
  };

  const shareHandler = (e) =>
    setShareMouse({ ...shareMouse, isShare: !shareMouse.isShare });

  return (
    <div
      className={classes.root}
      onMouseMove={(e) =>
        shareMouse.isShare ? shareMouseHandler(e.clientX, e.clientY) : null
      }
      // onClick={(e) =>
      //   setShareMouse({ ...shareMouse, isShare: !shareMouse.isShare })
      // }
    >
      {loading ? <Loading /> : null}
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
            {isSearchBoard ? (
              <SearchWhiteBoards setIsSearchBoard={setIsSearchBoard} />
            ) : (
              <span
                style={{ fontSize: "20px" }}
                onDoubleClick={(e) => setIsSearchBoard(true)}
              >
                {currentWhiteboard.name}
                <br />
                <ListItem style={{fontSize: '10px', justifyContent: "center", color: 'white'}}>{ currentWhiteboard.isPublic ? 'public' : 'private' }</ListItem>
              </span>
            )}
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
    </div>
  );
};
export default LoggedUserHomePage;
