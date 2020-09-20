import React, { useContext, useRef, useState } from "react";
import {
  Modal,
  makeStyles,
  Fade,
  Container,
  Grid,
  Button,
  Typography,
} from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import {
  BASE_URL,
  exceptionStatus,
  isErrorResponse,
} from "../../../Constants/Constant";
import LoadingContext from "../../../Providers/Context/LoadingContext";
import ExceptionContext from "../../../Providers/Context/ExceptionContext";
import Loading from "../Loading/Loading";
import { withRouter } from "react-router-dom";
import io from "socket.io-client";

const IncomingInvite = ({ isIncomingInvite, setIsIncomingInvite, accept, decline }) => {
  const socketRef = useRef();
  const useStyles = makeStyles((theme) => ({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));
  const classes = useStyles();

  const { setOpen } = useContext(ExceptionContext);

  // const accept = () => {
  //   socketRef.current = io("http://localhost:3000/chat");

  //   socketRef.current.emit("accept", isIncomingInvite.data);
  // };

  // const decline = () => {
  //   socketRef.current = io("http://localhost:3000/chat");
  //   socketRef.current.emit("decline", isIncomingInvite.data);
  // };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={isIncomingInvite.isInvite}
      onClose={(e) => setIsIncomingInvite({ data: {}, isInvite: false })}
      //   closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isIncomingInvite.isInvite}>
        <div className={classes.paper}>
          <Container component="main" maxWidth="xl">
            <Typography component="h1" variant="h5" align="center">
              {`User: ${isIncomingInvite.data.from} invite you in Whiteboard: "${isIncomingInvite.data.whiteboardName}"`}
            </Typography>
            <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={(e) => {
                        accept();
                        setIsIncomingInvite({ data: {}, isInvite: false });
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={(e) => {
                      decline();
                      setIsIncomingInvite({ data: {}, isInvite: false });
                    }}
                  >
                    Decline
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Container>
        </div>
      </Fade>
    </Modal>
  );
};
export default withRouter(IncomingInvite);
