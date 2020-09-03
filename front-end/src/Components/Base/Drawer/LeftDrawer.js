import React, { useState, useContext, useEffect, useRef } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import { TextField, Button, Container } from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import AuthContext from '../../../Providers/Context/AuthContext';
import io from 'socket.io-client';
import SingleMessage from '../SingleMessage/SingleMessage';
import IntegrationNotistack from '../../Page/Chat/Drawer';



const LeftDrawer = ({ onClose, openLeft}) => {

    const drawerWidth = 340;

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
    },
    toolbar: {
      paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 8px",
      ...theme.mixins.toolbar,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    menuButtonHidden: {
      display: "none",
    },
    title: {
      flexGrow: 1,
    },
    drawerPaper: {
      position: "relative",
      whiteSpace: "nowrap",
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerPaperLeft: {
      position: "relative",
      whiteSpace: "nowrap",
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerPaperClose: {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      height: "100vh",
      overflow: "auto",
    },
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
    },
    paper: {
      padding: theme.spacing(2),
      display: "flex",
      overflow: "auto",
      flexDirection: "column",
    },
    fixedHeight: {
      height: 240,
    },
    fab: {
      position: "absolute",
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  }));

  const classes = useStyles();

  const { user } = useContext(AuthContext);

  const socketRef = useRef();

  const [message, setMessage] = useState({
    from: user.id,
    avatar: user.avatarURL || '',
    room: user.id,
    message: '',
  })

  const [messages, setMessages] = useState([]);

  const pressEnter = (e) => e.key === 'Enter' ? sendMessage() : null;
  useEffect(() => {
    console.log('from useEffect');

    socketRef.current = io('http://localhost:3000/chat');

    socketRef.current.on('come-message', (data) => {
      setMessages(prev => [...prev, data]);
    })

  }, [messages]);

  const sendMessage = () => {
    socketRef.current.emit('send-message', message);
    setMessage(prev => ({...prev, message: '' }))
  }

  const onChangeHandler = (e) => {
    setMessage({...message, message: e.target.value})
  }

    return (
        <Drawer
      variant="persistent"
      classes={{
        paper: clsx(
          classes.drawerPaperLeft,
          !openLeft && classes.drawerPaperClose
        ),
      }}
      open={openLeft}
    >
      <div className={classes.toolbarIcon}></div>
      <Divider />
      <Toolbar>
        <IconButton
          className={clsx(
            classes.menuButton,
            !openLeft && classes.menuButtonHidden
          )}
        >
          <ChevronRightIcon onClick={onClose} />
        </IconButton>
        <TextField
          // multiline
          style={{
            backgroundColor: "white",
            borderRadius: "5px",
          }}
          fullWidth
          variant="outlined"
          id="firstName"
          value={message.message}
          onChange={onChangeHandler}
          onKeyPress={pressEnter}
        />
        <Button onClick={(e) => socketRef.current.emit('joinRoom', message.room)}>Join</Button>
      </Toolbar>
      <List>
        {messages.map( message => <SingleMessage key={`${message.from}-${Math.random()}`} from={message.from} avatar={""} message={message.message} />)}
      </List>
    </Drawer>
    )

};

export default LeftDrawer
