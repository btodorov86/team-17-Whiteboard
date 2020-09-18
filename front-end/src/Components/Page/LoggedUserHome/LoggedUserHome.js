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
  Button,
} from "@material-ui/core";
import AuthContext from "../../../Providers/Context/AuthContext";
import {
  logOutHandler,
  BASE_URL,
  isErrorResponse,
  exceptionStatus,
} from "../../../Constants/Constant";
import "react-chat-widget/lib/styles.css";
import Test from "./DrawingPage";
import Next from "@material-ui/icons/NavigateNext";
import Before from "@material-ui/icons/NavigateBefore";
import ProfileMenu from "./ProfileMenu";
// import DrawEraseWidget from "./DrawEraseWidget";
import "./chat.css";
import { SketchPicker } from "react-color";
// import pointer from "./pointer.jpg";
import LoadingContext from "../../../Providers/Context/LoadingContext";
import ExceptionContext from "../../../Providers/Context/ExceptionContext";
import Loading from "../Loading/Loading";
import SearchWhiteBoards from "./SearchWhiteBoards";
import CreateBoard from "./CreateBoard";
import ChangePassword from "./ChangePassword";
import ColorPalette from './ColorPalette';
import DeleteBoard from './DeleteBoard';
import UpdateBoard from './UpdateBoard';
import DrawingPage from './DrawingPage';
import ChangeAvatar from './ChangeAvatar';
import io from "socket.io-client";


const LoggedUserHomePage = ({ history, match }) => {
  const { user, setUser } = useContext(AuthContext);
  const { loading, setLoading } = useContext(LoadingContext);
  const { setOpen } = useContext(ExceptionContext);
  const socketRef = useRef();
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

  // const [avatar, setAvatar] = useState("");
  const [anchorEl, setAnchorEl] = useState(false);
  const [color, setColor] = useState("black");

  // const [shareMouse, setShareMouse] = useState({
  //   isShare: false,
  //   mouseX: 0,
  //   mouseY: 0,
  // });
  // const [currentWhiteboard, setCurrentWhiteboard] = useState({
  //   id: "",
  //   author: "",
  //   circles: [],
  //   rectangles: [],
  //   lines: [],
  //   textBoxes: [],
  //   name: "",
  //   isPublic: false,
  // });
  const [currentWhiteboard, setCurrentWhiteboard] = useState(null);
  // const [message, setMessage] = useState({
  //   room: user.email,
  //   from: user.id,
  //   avatar: user.avatarURL,
  // });
  // const [sharedUsers, setSharedUsers] = useState([]);
  // const [whiteboards, setWhiteboards] = useState([]);
  const [isSearchBoard, setIsSearchBoard] = useState(false);
  const [isCreateWhiteboard, setIsCreateWhiteboard] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [isDeleteBoard, setIsDeleteBoard] = useState(false);
  const [isUpdateBoard, setIsUpdateBoard] = useState(false);
  const [isChangeAvatar, setIsChangeAvatar] = useState(false);

  useEffect(() => {
    if (match.params.id === 'myProfile') {
      return;
    }
    setLoading(true);
    fetch(`${BASE_URL}/whiteboards/${match.params.id}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((r) => r.json())
      .then((resp) => {
        isErrorResponse(resp);
        setCurrentWhiteboard(resp);
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

  // useEffect(() => {
  //   socketRef.current = io("http://localhost:3000/chat");

  //   socketRef.current.emit("joinRoom", {
  //     room: message.room,
  //     userName: user.userName,
  //   });

  //   socketRef.current.on("come-message", (incomingMsg) => {
  //     setAvatar(
  //       "https://cnet2.cbsistatic.com/img/liJ9UZA87zs1viJiuEfVnL7YYfw=/940x0/2020/05/18/5bac8cc1-4bd5-4496-a8c3-66a6cd12d0cb/fb-avatar-2.jpg"
  //     );
  //     addResponseMessage(incomingMsg.message);
  //   });
  //   socketRef.current.on("joinedToRoom", (data) => {
  //     addResponseMessage(data);
  //   });

  //   socketRef.current.on("incomingMousePoints", (data) => {
  //     // console.log(data);
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

  // const handleNewUserMessage = (data) =>
  //   socketRef.current.emit("send-message", {
  //     message: data,
  //     room: message.room,
  //     avatar: message.avatar,
  //   });
  const leaveRoom = (room) => {
    socketRef.current = io("http://localhost:3000/chat");
    socketRef.current.emit('leaveRoom', {
      room,
      userName: user.userName
    })
  }

  const handleClickProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseProfile = () => {
    setAnchorEl(false);
  };

  // const shareMouseHandler = (x, y) => {
  //   if (
  //     Math.abs(shareMouse.mouseX - y) > 10 &&
  //     Math.abs(shareMouse.mouseY - x) > 10
  //   ) {
  //     setShareMouse({ ...shareMouse, mouseX: y, mouseY: x });
  //     socketRef.current.emit("sendMousePoints", {
  //       user: user.id,
  //       mouseX: y,
  //       mouseY: x,
  //       avatar: user.avatarURL,
  //       room: message.room,
  //     });
  //   }
  // };

  const showDrawingPage = currentWhiteboard ? (
    <DrawingPage color={color} currentWhiteboard={currentWhiteboard} stroke1={5} />
  ) : null;
  const toggleSketchPicker = match.params.id ? <ColorPalette color={color} setColor={setColor} /> : null;

  const toggleChangePassword = user ? (
    <ChangePassword
      isChangePassword={isChangePassword}
      setIsChangePassword={setIsChangePassword}
    />
  ) : null;

  const toggleIsDeleteBoard = user ? <DeleteBoard isDeleteBoard={isDeleteBoard} setIsDeleteBoard={setIsDeleteBoard} /> : null;
  const toggleIsUpdateBoard = user ? <UpdateBoard isUpdateBoard={isUpdateBoard} setIsUpdateBoard={setIsUpdateBoard} currentWhiteboard={currentWhiteboard} /> : null;
  const toggleIsChangeAvatar = user ? <ChangeAvatar isChangeAvatar={isChangeAvatar} setIsChangeAvatar={setIsChangeAvatar} /> : null;
  const togglePublicOrPrivateLabel = () => {
    if (match.params.id !== 'myProfile') {
      return currentWhiteboard?.isPublic ? "public" : "private"
    } else {
      return 'Search Board'
    }
  }

  return loading ? (
    <Loading />
  ) : (
    <div
      className={classes.root}
      // onMouseMove={(e) =>
      //   shareMouse.isShare ? shareMouseHandler(e.clientX, e.clientY) : null
      // }
      // onClick={(e) =>
      //   setShareMouse({ ...shareMouse, isShare: !shareMouse.isShare })
      // }
    >
      {/* {loading ? <Loading /> : null} */}
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
          <Button
            style={{
              border: "2px solid red",
              borderRadius: "50%",
              boxShadow: "6px 6px 3px darkblue",
            }}
          >
            <Avatar
              src={`${BASE_URL}/${user.avatarURL}`}
              alt={user.userName}
              style={{ cursor: "pointer" }}
              onClick={handleClickProfile}
            />
          </Button>
          <span style={{ fontSize: "25px", paddingLeft: "10px" }}>
            {user.userName}
          </span>
          <ProfileMenu
            anchorEl={anchorEl}
            handleClose={handleCloseProfile}
            setIsCreateWhiteboard={setIsCreateWhiteboard}
            setIsChangePassword={setIsChangePassword}
            setIsDeleteBoard={setIsDeleteBoard}
            setIsUpdateBoard={setIsUpdateBoard}
            setIsChangeAvatar={setIsChangeAvatar}
          />
          <ListItem style={{ justifyContent: "center" }}>
            <IconButton>
              <Before />
            </IconButton>
            {isSearchBoard ? (
              <SearchWhiteBoards setIsSearchBoard={setIsSearchBoard} leaveRoom={leaveRoom} />
            ) : (
              <Button
                style={{
                  border: "1px solid black",
                  backgroundColor: "red",
                  boxShadow: "6px 6px 3px darkblue",
                }}
                onClick={(e) => setIsSearchBoard(true) }
              >
                <span
                  style={{ paddingLeft: '10px', paddingRight: '10px', fontSize: "25px", justifyContent: "center" }}
                >
                  {currentWhiteboard?.name}
                </span>
                <span
                  style={{
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    fontSize: "10px",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  {togglePublicOrPrivateLabel()}
                </span>
              </Button>
            )}
            <IconButton>
              <Next />
            </IconButton>
          </ListItem>
          <span style={{ paddingRight: "10px", fontSize: "20px" }}>Logout</span>
          <ExitToApp
            style={{
              cursor: "pointer",
              boxShadow: "4px 4px 2px darkblue",
              border: "1px solid black",
              borderRadius: "5px",
            }}
            color="inherit"
            onClick={(e) => {
              e.preventDefault();
              leaveRoom(match.params.id)
              logOutHandler(setUser, history);
            }}
          />
        </Toolbar>
      </AppBar>
      {toggleIsDeleteBoard}
      {showDrawingPage}
      {toggleSketchPicker}
      {toggleIsUpdateBoard}
      {toggleIsChangeAvatar}
      <CreateBoard
        isCreateWhiteboard={isCreateWhiteboard}
        setIsCreateWhiteboard={setIsCreateWhiteboard}
        leaveRoom={leaveRoom}
      />
      {toggleChangePassword}
    </div>
  );
};
export default LoggedUserHomePage;
