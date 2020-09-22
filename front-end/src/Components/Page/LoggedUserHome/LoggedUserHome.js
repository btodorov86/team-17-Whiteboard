import React, { useContext, useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/Notifications";
import ExitToApp from "@material-ui/icons/ExitToApp";
import propType from 'prop-types';
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
import ColorPalette from "./ColorPalette";
import DeleteBoard from "./DeleteBoard";
import UpdateBoard from "./UpdateBoard";
import DrawingPage from "./DrawingPage";
import ChangeAvatar from "./ChangeAvatar";
import io from "socket.io-client";
import InviteUsers from "./InviteUsers";
import IncomingInvite from "./IncomingInvite";
import { AvatarGroup } from "@material-ui/lab";
import { addResponseMessage, Widget } from "react-chat-widget";
import ProfileMenu from "../../Base/ProfileMenu/ProfileMenu";
import ProfilePrivateMenu from "../../Base/ProfileMenu/ProfilePrivateMenu";
import KickUsers from "../../Base/KickUsers/KickUsers";
import SingleComment from '../../Base/Comments/SingleComment';
import CommentInput from '../../Base/Comments/CommentInput';

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
    boardNameBar: {
      paddingLeft: "10px",
      paddingRight: "10px",
      fontSize: "10px",
      justifyContent: "center",
      color: "white",
    },
    searchBoard: {
      // paddingLeft: "10px",
      paddingRight: "15px",
      // fontSize: "10px",
      justifyContent: "center",
      color: "white",
    }
  }));

  const classes = useStyles();

  const [avatar, setAvatar] = useState("");
  const [anchorEl, setAnchorEl] = useState(false);
  const [color, setColor] = useState("black");
  const [currentWhiteboard, setCurrentWhiteboard] = useState(null);
  const [shapes, setShapes] = useState([]);

  const [isSearchBoard, setIsSearchBoard] = useState(false);
  const [isCreateWhiteboard, setIsCreateWhiteboard] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [isDeleteBoard, setIsDeleteBoard] = useState(false);
  const [isUpdateBoard, setIsUpdateBoard] = useState(false);
  const [isChangeAvatar, setIsChangeAvatar] = useState(false);
  const [isInviteUser, setIsInviteUser] = useState(false);
  const [isKickUsers, setIsKickUsers] = useState(false);
  const [isShareMouse, setIsShareMouse] = useState(false);
  const [isIncomingInvite, setIsIncomingInvite] = useState({
    data: {},
    isInvite: false,
  });
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [sharedUsers, setSharedUsers] = useState([]);
  const [shareMouse, setShareMouse] = useState({
    mouseX: 0,
    mouseY: 0,
  });

  const [comments, setComments] = useState([]);
  const [isAddComment, setIsAddComment] = useState({
    isActive: false,
    x: 0,
    y: 0,
  });

  const [shapeHistory, setShapeHistory] = useState([]);
  useEffect(() => {
    socketRef.current = io("http://localhost:3000/chat");

    if (match.params.id === "my") {
      return;
    }
    if (!match.params.id && !user) {
      return;
    }

    setLoading(true);
    fetch(`${BASE_URL}/whiteboards/${match.params.id}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((r) => (r.status >= 500 ? history.push("/servererror") : r.json()))
      .then((resp) => {
        isErrorResponse(resp);
        socketRef.current.emit("joinRoom", {
          room: resp.id,
          userName: user.userName,
          avatar: user.avatarURL,
        });
        setCurrentWhiteboard(resp);
        setShapes(Object.keys(resp).reduce((acc, value) => {
          if (typeof resp[value] === 'object' && value !== 'comments') {
            return [...acc, ...resp[value]]
          }
          return acc
        }, []).sort((a, b) => a.itemPosition - b.itemPosition));
        setComments([...resp.comments])
      })
      .catch((err) =>
        setOpen({
          value: true,
          msg: err.message,
          statusType: exceptionStatus.error,
        })
      )
      .finally(() => setLoading(false));

    socketRef.current.on("sendInvite", (data) =>
      data.invited === user.userName
        ? setIsIncomingInvite({ data, isInvite: true })
        : null
    );
    socketRef.current.on("someOneDrawShape", (data) => {

    console.log(data);
    if (data.shape.type === 'comments') {
      setComments(prev => [...prev, data.shape])
    } else {
      setShapes(prev => [...prev, data.shape])
    }

    });
    socketRef.current.on("userAccepted", (data) =>
      data.from === user.userName
        ? setOpen({
            value: true,
            msg: `User: ${data.invited} accept your invite!`,
            statusType: exceptionStatus.success,
          })
        : null
    );
    socketRef.current.on("come-message", (incomingMsg) => {
      setAvatar(`${BASE_URL}/${incomingMsg.avatar}`);
      addResponseMessage(incomingMsg.message);
    });
    socketRef.current.on("joinedToRoom", (data) => {
      if (data.userName !== user.userName) {
        setUsersInRoom([
          ...usersInRoom,
          { avatar: data.avatar, userName: data.userName },
        ]);
      }
      addResponseMessage(data.message);
    });
    socketRef.current.on("userDeclined", (data) => {
      if (data.from === user.userName) {
        setOpen({
          value: true,
          msg: `User: ${data.invited} decline your invite!`,
          statusType: exceptionStatus.info,
        });
      }
    });
    socketRef.current.on("isKicked", (data) => {
      if (data.kicked === user.userName) {
        setOpen({
          value: true,
          msg: `You are kick from Whiteboard: ${data.whiteboardName} !`,
          statusType: exceptionStatus.warning,
        });
        history.push("my");
      }
    });

    socketRef.current.on("incomingMousePoints", (data) => {
      console.log(sharedUsers);
      const user = sharedUsers.find((x) => x.id === data.user);
      console.log(user);
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
  }, [match.params.id]);

  const undo = (shapes, history) => {
    // da se popravi proverkata
    if (!shapes.length) {
      return;
    }
    const lastShape = shapes.pop();
    fetch(
      `${BASE_URL}/whiteboards/${currentWhiteboard.id}/${lastShape.type}/${lastShape.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    )
      .then((r) => r.text())
      .then((resp) => {
        isErrorResponse(resp);
        setShapeHistory((prev) => [
          ...prev,
          { id: lastShape.id, type: lastShape.type },
        ]);
      })
      .catch((err) =>
        setOpen({
          value: true,
          msg: err.message,
          statusType: exceptionStatus.error,
        })
      )
      .finally(() => history.push(`/profile/${currentWhiteboard.id}`));
  };

  const redo = (setShapes, history) => {
    const lastShape = shapeHistory.pop();
    fetch(
      `${BASE_URL}/whiteboards/${currentWhiteboard.id}/${lastShape.type}/${lastShape.id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    )
      .then((r) => r.json())
      .then((resp) => {
        isErrorResponse(resp);
        setShapeHistory((prev) => [...prev]);
        setShapes((prev) => [...prev, resp]);
      })
      .catch((err) =>
        setOpen({
          value: true,
          msg: err.message,
          statusType: exceptionStatus.error,
        })
      )
      .finally(() => history.push(`/profile/${currentWhiteboard.id}`));
  };

  const leaveRoom = (room) => {
    socketRef.current = io("http://localhost:3000/chat");
    socketRef.current.emit("leaveRoom", {
      room,
      userName: user.userName,
    });
  };

  const handleClickProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseProfile = () => {
    setAnchorEl(false);
  };

  const accept = () => {
    socketRef.current = io("http://localhost:3000/chat");

    socketRef.current.emit("accept", isIncomingInvite.data);
  };

  const decline = () => {
    socketRef.current = io("http://localhost:3000/chat");
    socketRef.current.emit("decline", isIncomingInvite.data);
  };

  const inviteUserHandler = (invitedUsername) => {
    socketRef.current.emit("invite", {
      whiteboardId: currentWhiteboard.id,
      whiteboardName: currentWhiteboard.name,
      from: user.userName,
      invited: invitedUsername,
    });
  };
  const kickUserHandler = (kickedUsername) => {
    socketRef.current.emit("kick", {
      whiteboardId: currentWhiteboard.id,
      whiteboardName: currentWhiteboard.name,
      from: user.userName,
      kicked: kickedUsername,
    });
  };

  const isDrawShape = (shape) => {
    socketRef.current.emit('someOneDrawShape', {room: currentWhiteboard.id, shape})
  }

  const shareMouseHandler = (x, y) => {
    setShareMouse({ mouseX: y, mouseY: x });
    socketRef.current.emit("sendMousePoints", {
      user: user.id,
      mouseX: y,
      mouseY: x,
      avatar: user.avatarURL,
      room: currentWhiteboard.id,
    });
  };

  const togglePublicOrPrivateLabel = () => {
    if (match.params.id !== "my") {
      return currentWhiteboard?.isPublic ? "public" : "private";
    } else {
      return "Search Board";
    }
  };

  const handleNewUserMessage = (data) =>
    socketRef.current.emit("send-message", {
      message: data,
      room: currentWhiteboard.id,
      avatar: user.avatarURL,
      from: user.id,
    });

  const showDrawingPage = currentWhiteboard ? (
    <DrawingPage
      style={{alignSelf: 'flex-start'}}
      color={color}
      currentWhiteboard={currentWhiteboard}
      sharedUsers={sharedUsers}
      setShareMouse={setShareMouse}
      shareMouse={shareMouse}
      shareMouseHandler={shareMouseHandler}
      shapeHistory={shapeHistory}
      setShapeHistory={setShapeHistory}
      undo={undo}
      redo={redo}
      isShareMouse={isShareMouse}
      isDrawShape={isDrawShape}
      shapes={shapes}
      setShapes={setShapes}
      comments={comments}
      setComments={setComments}
      isAddComment={isAddComment}
      setIsAddComment={setIsAddComment}
    />
  ) : null;

  const toggleChat = currentWhiteboard ? (
    <Widget
      handleNewUserMessage={handleNewUserMessage}
      // showTimeStamp={false}
      profileAvatar={avatar}
      title={"Chat"}
      display={"inline-block"}
    />
  ) : null;

  // console.log(currentWhiteboard);

  return loading ? (
    <Loading />
  ) : (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={classes.appBar}
        style={{ width: "100%", backgroundColor: "#d4de23" }}
      >
        <Toolbar className={classes.toolbar}>
          <Button
            style={{
              border: "2px solid #4d5842",
              borderRadius: "50%",
              boxShadow: "2px 2px 1px darkgreen",
              backgroundColor: "#6fa241",
            }}
          >
            <Avatar
              src={`${BASE_URL}/${user.avatarURL}`}
              alt={user.userName}
              style={{ cursor: "pointer" }}
              onClick={handleClickProfile}
            />
          </Button>
          <span
            style={{
              fontSize: "25px",
              paddingLeft: "10px",
              fontFamily: "monospace",
              fontWeight: "bold",
            }}
          >
            {user.userName}
          </span>
          {currentWhiteboard && currentWhiteboard.author === user.id ? (
            <ProfilePrivateMenu
              anchorEl={anchorEl}
              handleClose={handleCloseProfile}
              setIsCreateWhiteboard={setIsCreateWhiteboard}
              setIsChangePassword={setIsChangePassword}
              setIsDeleteBoard={setIsDeleteBoard}
              setIsUpdateBoard={setIsUpdateBoard}
              setIsChangeAvatar={setIsChangeAvatar}
              setIsInviteUser={setIsInviteUser}
              currentWhiteboard={currentWhiteboard}
              setIsKickUsers={setIsKickUsers}
              setIsShareMouse={setIsShareMouse}
              setIsAddComment={setIsAddComment}
            />
          ) : (
            <ProfileMenu
              anchorEl={anchorEl}
              handleClose={handleCloseProfile}
              setIsCreateWhiteboard={setIsCreateWhiteboard}
              setIsChangePassword={setIsChangePassword}
              setIsDeleteBoard={setIsDeleteBoard}
              setIsUpdateBoard={setIsUpdateBoard}
              setIsChangeAvatar={setIsChangeAvatar}
              setIsInviteUser={setIsInviteUser}
              setIsShareMouse={setIsShareMouse}
              currentWhiteboard={currentWhiteboard}
            />
          )}

          <ListItem style={{ justifyContent: "center" }}>
            <IconButton>
              <Before
                onClick={(e) => {
                  e.preventDefault();
                  history.push(`${currentWhiteboard.id}/undo`);
                }}
              />
            </IconButton>
            {isSearchBoard ? (
              <SearchWhiteBoards
                setIsSearchBoard={setIsSearchBoard}
                leaveRoom={leaveRoom}
              />
            ) : (
              <Button
                style={{
                  border: "2px solid #4d5842",
                  backgroundColor: "#6fa241",
                  boxShadow: "3px 3px 1px darkgreen",
                }}
                onClick={(e) => setIsSearchBoard(true)}
              >
                <span
                  style={{
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    fontSize: "22px",
                    justifyContent: "center",
                    fontFamily: "monospace",
                    fontWeight: "bold",
                  }}
                >
                  {currentWhiteboard?.name}
                </span>
                <span className={match.params.id !== "my" ? classes.boardNameBar : classes.searchBoard}
                  // style={{
                  //   paddingLeft: "10px",
                  //   paddingRight: "10px",
                  //   fontSize: "10px",
                  //   justifyContent: "center",
                  //   color: "white",
                  // }}
                >
                  {togglePublicOrPrivateLabel()}
                </span>
              </Button>
            )}
            <IconButton>
              <Next
                onClick={(e) => {
                  e.preventDefault();
                  return shapeHistory.length === 0
                    ? null
                    : history.push(`${currentWhiteboard.id}/redo`);
                }}
              />
            </IconButton>
          </ListItem>
          {usersInRoom.length ? (
            <AvatarGroup max={4} style={{ paddingRight: 20 }}>
              {usersInRoom.map((x) => (
                <Avatar
                  key={x.avatar}
                  alt={x.userName}
                  src={`${BASE_URL}/${x.avatar}`}
                />
              ))}
            </AvatarGroup>
          ) : null}
          <span
            style={{
              paddingRight: "10px",
              fontSize: "18px",
              fontFamily: "monospace",
            }}
          >
            Logout
          </span>
          <ExitToApp
            style={{
              cursor: "pointer",
              boxShadow: "3px 3px 1px darkgreen",
              border: "1px solid #4d5842",
              borderRadius: "3px",
              backgroundColor: "#6fa241",
            }}
            color="inherit"
            onClick={(e) => {
              e.preventDefault();
              leaveRoom(match.params.id);
              logOutHandler(setUser, history);
            }}
          />
        </Toolbar>
      </AppBar>
      <DeleteBoard
        isDeleteBoard={isDeleteBoard}
        setIsDeleteBoard={setIsDeleteBoard}
      />
      <UpdateBoard
        isUpdateBoard={isUpdateBoard}
        setIsUpdateBoard={setIsUpdateBoard}
        currentWhiteboard={currentWhiteboard}
      />
      {showDrawingPage}
      <ColorPalette color={color} setColor={setColor} />
      <ChangeAvatar
        isChangeAvatar={isChangeAvatar}
        setIsChangeAvatar={setIsChangeAvatar}
      />
      {toggleChat}
      <InviteUsers
        setIsInviteUser={setIsInviteUser}
        isInviteUser={isInviteUser}
        currentWhiteboard={currentWhiteboard}
        inviteUserHandler={inviteUserHandler}
      />
      <CreateBoard
        isCreateWhiteboard={isCreateWhiteboard}
        setIsCreateWhiteboard={setIsCreateWhiteboard}
        leaveRoom={leaveRoom}
      />
      <IncomingInvite
        setIsIncomingInvite={setIsIncomingInvite}
        isIncomingInvite={isIncomingInvite}
        decline={decline}
        accept={accept}
      />
      <ChangePassword
        isChangePassword={isChangePassword}
        setIsChangePassword={setIsChangePassword}
      />
      <KickUsers
        currentWhiteboard={currentWhiteboard}
        isKickUsers={isKickUsers}
        setIsKickUsers={setIsKickUsers}
        kickUserHandler={kickUserHandler}
      />

    </div>
  );
};

LoggedUserHomePage.propType = {
  history: propType.object.isRequired,
  match: propType.object.isRequired,
};
export default LoggedUserHomePage;
