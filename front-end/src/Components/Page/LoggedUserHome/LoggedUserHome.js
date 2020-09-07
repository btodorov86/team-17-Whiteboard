import React, { useContext, useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/Notifications";
import ExitToApp from "@material-ui/icons/ExitToApp";
import { ListItemAvatar, Avatar } from "@material-ui/core";
import AuthContext from "../../../Providers/Context/AuthContext";
import { logOutHandler, BASE_URL } from "../../../Constants/Constant";
import { Widget, addResponseMessage } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import io from "socket.io-client";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Test from "../../../Test";
import { SketchPicker } from 'react-color';

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
  const [color, setColor] = useState('black')
  const [anchorEl, setAnchorEl] = React.useState(null);
  const socketRef = useRef();
  socketRef.current = io("http://localhost:3000/chat");

  const [message, setMessage] = useState({
    message: "",
    room: user.email,
    from: "dsfsdf",
    avatar: user.avatarURL,
  });

  console.log(user);

  useEffect(() => {
    socketRef.current.emit("joinRoom", message.room);
    socketRef.current.on("come-message", (incomingMsg) => {
      setAvatar(
        "https://cnet2.cbsistatic.com/img/liJ9UZA87zs1viJiuEfVnL7YYfw=/940x0/2020/05/18/5bac8cc1-4bd5-4496-a8c3-66a6cd12d0cb/fb-avatar-2.jpg"
      );
      // setAvatar(incomingMsg.avatar)
      return incomingMsg.from === message.from
        ? null
        : addResponseMessage(incomingMsg.message);
    });
  }, []);

  const handleNewUserMessage = (data) =>
    socketRef.current.emit("send-message", {
      message: data,
      room: message.room,
      from: message.from,
      avatar: message.avatar,
    });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="absolute"
          className={classes.appBar}
        >
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
                onClick={handleClick}
              />
            </ListItemAvatar>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              {user.userName}
            </Typography>
            <Menu
              style={{ top: "-4px" }}
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose} style={{ margin: "10px" }}>
                Create board
              </MenuItem>
              <MenuItem onClick={handleClose} style={{ margin: "10px" }}>
                Change password
              </MenuItem>
              <MenuItem onClick={handleClose} style={{ margin: "10px" }}>
                Update avatar
              </MenuItem>
            </Menu>
            <span style={{ paddingRight: "10px" }}>Log Out</span>
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
        <div style={{position:'absolute', marginTop:'60px', display:'inline-block'}}>
        <SketchPicker color={color} onChange={(color)=>{setColor(color.hex)}}/>
        </div>
        <Widget
          handleNewUserMessage={handleNewUserMessage}
          showTimeStamp={false}
          profileAvatar={avatar}
          title={"Chat"}
        />
      </div>
    </>
  );
};
export default LoggedUserHomePage;
