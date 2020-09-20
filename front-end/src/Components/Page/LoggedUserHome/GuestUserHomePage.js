import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import LoginIcon from "@material-ui/icons/Add";
import {
  ListItem,
} from "@material-ui/core";
import AuthContext from "../../../Providers/Context/AuthContext";
import {
  logOutHandler,
} from "../../../Constants/Constant";
import "react-chat-widget/lib/styles.css";
import Test from "./DrawingPage";
import ColorPalette from './ColorPalette';

const GuestUserHomePage = ({ history }) => {
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

  const [color, setColor] = useState("black");

  const [currentWhiteboard, setCurrentWhiteboard] = useState({
    lines: [],
    circles: [],
    textBoxes: [],
    rectangles: [],
    name: 'My board',
  });

  return (
    <div
      className={classes.root}
    >
      <CssBaseline />
      <AppBar position="absolute" className={classes.appBar} style={{width: "100%", backgroundColor: "#d4de23"}}>
        <Toolbar className={classes.toolbar}>
          <ListItem style={{ justifyContent: "center" }} />
          <span style={{ paddingRight: "10px", fontSize: "18px", fontFamily: "monospace"}}>{ user ? 'Logout' : 'Login' }</span>
          <LoginIcon       // find correct icon !!!
            style={{
              cursor: "pointer",
              boxShadow: "3px 3px 1px darkgreen",
              border: "1px solid #4d5842",
              borderRadius: "3px",
              backgroundColor: "#6fa241"
            }}
            color="inherit"
            onClick={(e) => {
              e.preventDefault();
              user ? logOutHandler(setUser, history) : history.push('/home');
            }}
          />
        </Toolbar>
      </AppBar>
      <Test color={color} currentWhiteboard={currentWhiteboard} />
      <ColorPalette color={color} setColor={setColor} />
    </div>
  );
};
export default GuestUserHomePage;
