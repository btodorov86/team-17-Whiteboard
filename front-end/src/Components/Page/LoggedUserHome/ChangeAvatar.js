import React, { useContext, useState } from "react";
import {
  Modal,
  makeStyles,
  Fade,
  Container,
  Grid,
  Button,
  TextField,
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
import AuthContext from '../../../Providers/Context/AuthContext';
import { withRouter } from 'react-router-dom';

const ChangeAvatar = ({ isChangeAvatar, setIsChangeAvatar, history }) => {

  const { user } = useContext(AuthContext)
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
  const [changeAvatar, setChangeAvatar] = useState({
    avatar: {
      isValid: true,
      isTouched: false,
      value: [],
    },
  });
  const updateState = (prop, value) => {
    setChangeAvatar({
      ...changeAvatar,
      [prop]: {
        isTouched: true,
        value,
        isValid:
          prop !== "avatar"
            ? userValidation[prop].reduce(
                (acc, validateFn) =>
                  acc && typeof validateFn(value) === "boolean",
                true
              )
            : true,
      },
    });
  };

  const userValidation = {
    avatar: [(data) => data.length || "Please upload avatar !"],
  };

  const renderError = (prop) => {
    return changeAvatar[prop].isTouched
      ? userValidation[prop]
          .map((fn) => fn(changeAvatar[prop].value))
          .filter((x) => typeof x === "string")
          .map((err, index) => (
            <p key={index} style={{ color: "red" }}>
              {err}
            </p>
          ))
      : null;
  };

  const uploadFiles = (id) => {
    const formData = new FormData();
    if (!changeAvatar.avatar.value.length) {
      return;
    }

    formData.append("files", changeAvatar.avatar.value[0]);

    fetch(`${BASE_URL}/users/${id}/avatar`, {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
      body: formData,
    })
      .then((r) => r.status >= 500 ? history.push('/servererror') : r.json())
      .then((resp) => {
        isErrorResponse(resp); // add history in isErrorResponse
        setOpen({
          value: true,
          msg: "Successes!",
          statusType: exceptionStatus.success,
        });
      })
      .catch((err) =>
        setOpen({
          value: true,
          msg: err.message,
          statusType: exceptionStatus.error,
        })
      )
      .finally(() => setIsChangeAvatar(false))
  };

  const isDisable = () => {
    return !Object.values(changeAvatar).reduce((acc, value) => {
      return value.isTouched && value.isValid && acc ? true : false;
    }, true);
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={isChangeAvatar}
      onClose={(e) => setIsChangeAvatar(false)}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isChangeAvatar}>
        <div className={classes.paper}>
          <Container component="main" maxWidth="xl">
            <Typography component="h1" variant="h5" align="center">
              Change Avatar
            </Typography>
            <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <input
                    accept="image/*"
                    // className={classes.input}
                    style={{ display: "none" }}
                    id="raised-button-file"
                    multiple
                    type="file"
                    onChange={(e) =>
                      updateState("avatar", Array.from(e.target.files))
                    }
                  />
                  <label htmlFor="raised-button-file">
                    <Button
                      variant="contained"
                      component="span"
                      fullWidth
                      color='primary'
                      style={{backgroundColor: '#6fa241', cursor: 'pointer'}}
                      className={classes.submit}
                    >
                      Upload Avatar
                    </Button>
                  </label>
                  {renderError('avatar')}
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={{backgroundColor: "#6fa241"}}
                    className={classes.submit}
                    disabled={isDisable()}
                    onClick={(e) => uploadFiles(user.id)}
                  >
                    Upload
                  </Button>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={{backgroundColor: "#6fa241"}}
                    // className={classes.submit}
                    onClick={(e) => setIsChangeAvatar(false)}
                  >
                    Cancel
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
export default withRouter(ChangeAvatar);
