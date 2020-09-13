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

const ChangePassword = ({ isChangePassword, setIsChangePassword }) => {
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
  const [changePassword, setChangePassword] = useState({
    currentPassword: {
      isValid: true,
      isTouched: false,
      value: "",
    },
    repeatPassword: {
      isValid: true,
      isTouched: false,
      value: "",
    },
    newPassword: {
      isValid: true,
      isTouched: false,
      value: "",
    },
  });
  const updateState = (prop, value) => {
    setChangePassword({
      ...changePassword,
      [prop]: {
        isTouched: true,
        value,
        isValid: userValidation[prop].reduce((acc, validateFn) => acc && (typeof validateFn(value) === 'boolean'), true)
      }
    })
  }

  const userValidation = {
    newPassword: [
        (data) =>
          /^[a-zA-Z0-9]{6,16}$/.test(data) || "Password must have 6 to 16 characters",
        (data) =>
          /\d/.test(data) || "Password must contain minimum 1 digit",
        (data) =>
          /[A-Z]/.test(data) || "Password must contain minimum 1 upper case alphabet",
      ],
      repeatPassword: [
        (data) => changePassword.currentPassword.value === data || "Password not match",
      ],
      currentPassword: [
        (data) => changePassword.currentPassword.value.length !== data || "Enter password",
      ],
  };

  const renderError = (prop) => {
    return changePassword[prop].isTouched ? userValidation[prop]
    .map(fn => fn(changePassword[prop].value))
    .filter( x => typeof x === 'string')
    .map( (err, index) => <p key={index} style={{color: 'red'}}>{err}</p>) : null
  };

  const update = () => {
    setLoading(true);
    const sendObj = {
      currentPassword: changePassword.currentPassword.value,
      newPassword: changePassword.newPassword.value
    };
    fetch(`${BASE_URL}/users`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(sendObj),
    })
      .then((r) => r.json())
      .then((resp) => {
        console.log(resp);
        isErrorResponse(resp);
        setOpen({
          value: true,
          msg: 'Password changed!',
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
      .finally(() => (setLoading(false),
      setIsChangePassword(false), setChangePassword({
        currentPassword: {
          isValid: true,
          isTouched: false,
          value: "",
        },
        repeatPassword: {
          isValid: true,
          isTouched: false,
          value: "",
        },
        newPassword: {
          isValid: true,
          isTouched: false,
          value: "",
        },
      })))
  };

  const isDisable = () => {
    return !Object.values(changePassword).reduce((acc, value) => {
      return value.isTouched && value.isValid && acc ? true : false
    }, true)
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={isChangePassword}
      onClose={(e) => setIsChangePassword(false)}
      //   closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isChangePassword}>
        <div className={classes.paper}>
          {loading ? <Loading /> : null}
          <Container component="main" maxWidth="xl">
            <Typography component="h1" variant="h5" align="center">
              Change Password
            </Typography>
            <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="password"
                    value={changePassword.currentPassword.value}
                    error={!changePassword.currentPassword.isValid}
                    onChange={(e) =>
                      updateState("currentPassword", e.target.value.trim())
                    }
                  />
                  </Grid>
                  <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="Confirm-password"
                    label="Confirm password"
                    type="password"
                    id="confirm-password"
                    autoComplete="repeat-password"
                    value={changePassword.repeatPassword.value}
                    error={!changePassword.repeatPassword.isValid}
                    onChange={(e) =>
                      updateState("repeatPassword", e.target.value.trim())
                    }
                  />
                  {renderError("repeatPassword")}
                  </Grid>
                  <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="new-password"
                    label="New Password"
                    type="password"
                    id="new-password"
                    autoComplete="new-password"
                    value={changePassword.newPassword.value}
                    error={!changePassword.newPassword.isValid}
                    onChange={(e) =>
                      updateState("newPassword", e.target.value.trim())
                    }
                  />
                  {renderError("newPassword")}
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={(e) => update()}
                    disabled={isDisable()}
                  >
                    Update
                  </Button>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={(e) => setIsChangePassword(false)}
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
export default ChangePassword;
