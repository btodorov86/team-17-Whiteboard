import React, { useContext, useState, useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import Container from "@material-ui/core/Container";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsIcon from "@material-ui/icons/Notifications";
import ExitToApp from "@material-ui/icons/ExitToApp";
import { Fab } from "@material-ui/core";
import AuthContext from '../../../Providers/Context/AuthContext';
import { logOutHandler } from '../../../Constants/Constant';
import RightDrawer from '../../Base/Drawer/RightDrawer';
import LeftDrawer from '../../Base/Drawer/LeftDrawer';
import { Stage, Layer, Line } from 'react-konva';

const LoggedUserHomePage = ({ history }) => {

  const { user, setUser } = useContext(AuthContext);


  const drawerWidth = 240;

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

  const [open, setOpen] = React.useState(false);
  const [openLeft, setOpenLeft] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleDrawerLeftOpen = () => {
    setOpenLeft(true);
  };
  const handleDrawerLeftClose = () => {
    setOpenLeft(false);
  };

  const toggleChatBtn = !openLeft ? (
    <Fab
      color="secondary"
      className={classes.fab}
      onClick={handleDrawerLeftOpen}
    >
      Chat
    </Fab>
  ) : null;

  const [line, setline] = useState({
    points: [],
    drawing: false
  })
  const [shapes, setShapes] = useState([])

  const mouseDown = (e) => {
    setline({...line, drawing: true})
  }
  const mouseMove = (e) => {
    if (line.drawing) {
      setline({...line, points: [...line.points, e.evt.clientX, e.evt.clientY]})
    }
  }
  const mouseUp = (e) => {
    setline({...line, drawing: false})
    setShapes([...shapes, line])
  }



  return (
    <>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="absolute"
          className={clsx(classes.appBar, open && classes.appBarShift)}
        >
          <Toolbar className={classes.toolbar}>
            <IconButton
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
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              {user.userName}
            </Typography>
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
        <RightDrawer open={open} onClose={handleDrawerClose} />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
          <Stage onMouseDown={mouseDown} onMouseMove={mouseMove} onMouseUp={mouseUp} height={window.innerHeight} width={window.innerWidth}>
              <Layer>
                <Line points={line.points} stroke="black" strokeWidth={"5"} />
                {/* {shapes.map( shape => <Line stroke={'red'} strokeWidth={5} points={line.points} />)} */}
              </Layer>
            </Stage>
            {/* <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>{children}</Paper>
            </Grid>
          </Grid>
          <Box pt={4}></Box> */}
          </Container>
        </main>
        <LeftDrawer onClose={handleDrawerLeftClose} openLeft={openLeft} />
      </div>
      {toggleChatBtn}
    </>
  );
};

export default LoggedUserHomePage;
