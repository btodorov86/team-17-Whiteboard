import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
// import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { TextField } from "@material-ui/core";
import SingleUser from '../SingleUser/SingleUser';
import AdminSideBar from '../SideBars/AdminSideBar';

const RightDrawer = ({ open, onClose, setReRender, reRender }) => {

    const drawerWidth = 240;

    const useStyles = makeStyles((theme) => ({
    //   root: {
    //     display: "flex",
    //   },
    //   toolbar: {
    //     paddingRight: 24, // keep right padding when drawer closed
    //   },
    //   toolbarIcon: {
    //     display: "flex",
    //     alignItems: "center",
    //     justifyContent: "flex-end",
    //     padding: "0 8px",
    //     ...theme.mixins.toolbar,
    //   },
    //   appBar: {
    //     zIndex: theme.zIndex.drawer + 1,
    //     transition: theme.transitions.create(["width", "margin"], {
    //       easing: theme.transitions.easing.sharp,
    //       duration: theme.transitions.duration.leavingScreen,
    //     }),
    //   },
    //   appBarShift: {
    //     marginLeft: drawerWidth,
    //     width: `calc(100% - ${drawerWidth}px)`,
    //     transition: theme.transitions.create(["width", "margin"], {
    //       easing: theme.transitions.easing.sharp,
    //       duration: theme.transitions.duration.enteringScreen,
    //     }),
    //   },
    //   menuButton: {
    //     marginRight: 36,
    //   },
    //   menuButtonHidden: {
    //     display: "none",
    //   },
    //   title: {
    //     flexGrow: 1,
    //   },
      drawerPaper: {
        position: "relative",
        whiteSpace: "nowrap",
        width: drawerWidth,
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    //   drawerPaperLeft: {
    //     position: "relative",
    //     whiteSpace: "nowrap",
    //     width: drawerWidth,
    //     transition: theme.transitions.create("width", {
    //       easing: theme.transitions.easing.sharp,
    //       duration: theme.transitions.duration.enteringScreen,
    //     }),
    //   },
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
    //   appBarSpacer: theme.mixins.toolbar,
    //   content: {
    //     flexGrow: 1,
    //     height: "100vh",
    //     overflow: "auto",
    //   },
    //   container: {
    //     paddingTop: theme.spacing(4),
    //     paddingBottom: theme.spacing(4),
    //   },
    //   paper: {
    //     padding: theme.spacing(2),
    //     display: "flex",
    //     overflow: "auto",
    //     flexDirection: "column",
    //   },
    //   fixedHeight: {
    //     height: 240,
    //   },
    //   fab: {
    //     position: "absolute",
    //     bottom: theme.spacing(2),
    //     right: theme.spacing(2),
    //   },
    }));

    const classes = useStyles();

    return (
        <Drawer
      variant="permanent"
      classes={{
        paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
      }}
      open={open}
    >
      <div className={classes.toolbarIcon}>
        <Toolbar>
          <TextField
            placeholder={"Search User"}
            style={{
              backgroundColor: "white",
              borderRadius: "5px",
            }}
            fullWidth
            variant="outlined"
            id="firstName"
          />
          <IconButton onClick={onClose}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
      </div>
      <List>
        { !open ? <AdminSideBar setReRender={setReRender} reRender={reRender} /> : [1, 2, 3].map( x => <SingleUser name={""} avatar={""} />) }
      </List>
      {/* <Divider />
      <List>
        <div></div>
      </List> */}
    </Drawer>
    )

};

export default RightDrawer
