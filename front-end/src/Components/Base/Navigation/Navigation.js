import React, { useContext, useState } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import {
  FormControlLabel,
  Switch,
  Avatar,
  Button,
  Fab,
} from "@material-ui/core";
import { logOutHandler, BASE_URL } from "../../../Constants/Constant";
import AuthContext from "../../../Providers/Context/AuthContext";
import { withRouter } from "react-router-dom";
import AlignItemsList from '../../Page/Chat/Chat1';

const Navigation = ({ history, location }) => {
  const { user, setUser } = useContext(AuthContext);

  // const [auth, setAuth] = useState(!!user);

  const [open, setOpen] = useState(false);

  const [bookName, setBookName] = useState("");

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const searchHandler = () => {
    return bookName ? history.push(`/books/search/${bookName}`) : null;
  };

  const handleChange = (event) => {
    event.target.checked
      ? history.push("/login")
      : logOutHandler(setUser, history);
  };

  const useStyles = makeStyles((theme) => ({
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "block",
      },
    },
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    inputRoot: {
      color: "inherit",
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "20ch",
      },
    },
    sectionDesktop: {
      display: "none",
      [theme.breakpoints.up("md")]: {
        display: "flex",
      },
    },
    fab: {
      position: "absolute",
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  }));

  const classes = useStyles();

  const toggleAvatar = !!user ? (
    <>
      <Avatar
        alt="My Avatar"
        src={`${BASE_URL}/${user.avatarURL}`}
        onClick={(e) => (!!user ? history.push("/account") : null)}
        style={{ cursor: "pointer" }}
      />
      <div
        style={{
          marginBottom: "7px",
          marginLeft: "10px",
          fontSize: "22px",
          marginTop: "3px",
        }}
      >
        {user.userName}
      </div>
    </>
  ) : (
    <>
      <Avatar
        alt="My Avatar"
        src={`${BASE_URL}/avatar.png`}
        onClick={(e) => (!!user ? history.push("/account") : null)}
        style={{ cursor: "pointer" }}
      />
      <div
        style={{
          marginBottom: "7px",
          marginLeft: "10px",
          fontSize: "22px",
          marginTop: "3px",
        }}
      ></div>
    </>
  );

  const menuId = "primary-search-account-menu";

  return location.pathname.includes("admin") ||
    location.pathname.includes("account") ? null : (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            className={classes.title}
            variant="h6"
            style={{ cursor: "pointer" }}
            noWrap
            onClick={() => history.push("/")}
          >
            Make Friends With Your Whiteboard
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
            />
            <Button onClick={(e) => (e.preventDefault(), searchHandler())}>
              Search
            </Button>
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {!!user ? (
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={(e) => (!!user ? history.push("/account") : null)}
                color="inherit"
              ></IconButton>
            ) : null}
            {toggleAvatar}
            <FormControlLabel
              style={{ margin: "auto" }}
              control={
                <Switch
                  checked={!!user}
                  onChange={handleChange}
                  aria-label="login switch"
                />
              }
              label={!!user ? "Logout" : "Login"}
            />
          </div>
        </Toolbar>
      </AppBar>
      { !open ? <Fab color="secondary" className={classes.fab} onClick={handleDrawerOpen}>
        Chat
      </Fab> : <AlignItemsList onClose={handleDrawerClose}/> }
    </div>
  );
};

export default withRouter(Navigation);
