import React, { useContext, useState } from "react";
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
import { withRouter } from 'react-router-dom';

const DeleteBoard = ({isDeleteBoard, setIsDeleteBoard, match}) => {
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

  const { loading, setLoading } = useContext(LoadingContext);
  const { setOpen } = useContext(ExceptionContext);
  const [showDeleteButton, setShowDeleteButton] = useState(true);

  const deleteBoard = () => {
    setLoading(true);
    fetch(`${BASE_URL}/whiteboards/${match.params.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((r) => r.text())
      .then((resp) => {
        isErrorResponse(resp);
        setOpen({
          value: true,
          msg: `Board is deleted!`,
          statusType: exceptionStatus.success,
        });
      })
      .catch((err) => {
        setOpen({
          value: true,
          msg: err.message,
          statusType: exceptionStatus.error,
        });
      })
      .finally(
        () => {
          setLoading(false);
          setIsDeleteBoard(false);
        }
      );
  };

  const toggleDeleteButton = showDeleteButton ? <Grid item xs={12}>
  <Button
    type="button"
    fullWidth
    variant="contained"
    color="primary"
    className={classes.submit}
    onClick={(e) => setShowDeleteButton(false)}
  >
    Delete
  </Button></Grid> : null

  const toggleConfirmGroup = !showDeleteButton ? <Grid item xs={12}>
  <Button
    type="button"
    fullWidth
    variant="contained"
    color="primary"
    className={classes.submit}
    onClick={(e) => deleteBoard()}
  >
    Confirm
  </Button>
  <Button
    type="button"
    fullWidth
    variant="contained"
    color="primary"
    onClick={(e) => {
      setIsDeleteBoard(false);
    }}
  >
    Cancel
  </Button>
</Grid> : null


  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={isDeleteBoard}
      onClose={(e) => setIsDeleteBoard(false)}
      //   closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isDeleteBoard}>
        <div className={classes.paper}>
          {loading ? <Loading /> : null}
          <Container component="main" maxWidth="xl">
            <Typography component="h1" variant="h5" align="center">
              { showDeleteButton ? 'Delete Whiteboard' : 'Are you sure to delete this board ?' }
            </Typography>
            <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                {toggleDeleteButton}
                {toggleConfirmGroup}
              </Grid>
            </form>
          </Container>
        </div>
      </Fade>
    </Modal>
  );
};
export default withRouter(DeleteBoard);
