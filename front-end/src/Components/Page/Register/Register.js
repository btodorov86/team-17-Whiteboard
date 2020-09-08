import React, { useState, useContext } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import {
  BASE_URL,
  isErrorResponse,
  exceptionStatus,
} from "../../../Constants/Constant";
import { withRouter } from "react-router-dom";
import AuthContext from "../../../Providers/Context/AuthContext";
import ExceptionContext from "../../../Providers/Context/ExceptionContext";

const Register = ({
  isLoginPage,
  setIsLoginPage,
  history,
  isPasswordChange,
}) => {
  const { user } = useContext(AuthContext);

  const { setOpen } = useContext(ExceptionContext);

  const [errorValidationMessage, setErrorValidationMessage] = useState([])

  const [createUser, setCreateUser] = useState({
    firstName: {
      isValid: true,
      isTouched: false,
      value: "",
    },
    lastName: {
      isValid: true,
      isTouched: false,
      value: "",
    },
    email: {
      isValid: true,
      isTouched: false,
      value: "",
    },
    userName: {
      isValid: true,
      isTouched: false,
      value: "",
    },
    password: {
      isValid: true,
      isTouched: false,
      value: "",
    },
    confirmPassword: {
      isValid: true,
      isTouched: false,
      value: "",
    }
  });

  const updateState = (prop, value) => {
    setCreateUser({
      ...createUser,
      [prop]: {
        isTouched: true,
        value,
        isValid: userValidation[prop].reduce((acc, validateFn) => acc && (typeof validateFn(value) === 'boolean'), true)
      }
    })
  }

  const userValidation = {
    firstName: [
      (data) => data?.length > 0 || "First name field is empty",
      (data) => !/[0-9]/.test(data) || "First name can't include digit",
  ],
    lastName: [
      (data) => data?.length > 0 || "Enter Last name",
      (data) => !/[0-9]/.test(data) || "Last name can't include digit",
    ],
    email: [
      (data) =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          data
        ) || "Invalid email address",
    ],
    userName: [
      (data) =>
      /^[a-zA-Z0-9]{6,16}$/.test(data) || "User name must have 6 to 16 characters",
    ],
    password: [
      (data) =>
        /^[a-zA-Z0-9]{6,16}$/.test(data) || "Password must have 6 to 16 characters",
      (data) =>
        /\d/.test(data) || "Password must contain minimum 1 digit",
      (data) =>
        /[A-Z]/.test(data) || "Password must contain minimum 1 upper case alphabet",
    ],
    confirmPassword: [
      (data) => createUser.password.value === data || "Password not match",
    ],
  };

  const updateHandler = (e) => {
    e.preventDefault();

    let URL = `${BASE_URL}/users/${user.id}`;

    let updateObj = {
      firstName: createUser.firstName,
      lastName: createUser.lastName,
      password: createUser.password,
    };

    fetch(URL, {
      method: "PUT",
      headers: {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateObj),
    })
      .then((r) => r.json())
      .then((resp) => {
        isErrorResponse(resp);
        history.goBack();
      })
      .catch((err) =>
        setOpen({
          value: true,
          msg: err.message,
          statusType: exceptionStatus.error,
        })
      );
  };

  const signInHandler = (e) => {
    fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        firstName: createUser.firstName.value,
        lastName: createUser.lastName.value,
        userName: createUser.userName.value,
        email: createUser.email.value,
        password: createUser.password.value,
      }),
    })
      .then((r) => r.json())
      .then((resp) => {
        if (resp.error) {
          isErrorResponse(resp);
        }

        setIsLoginPage(!isLoginPage);
      })
      .catch((err) =>
        setOpen({
          value: true,
          msg: err.message,
          statusType: exceptionStatus.error,
        })
      );
  };

  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
      height: "80px",
      width: "80px",
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



  const isDisable = () => {
    return !Object.values(createUser).reduce((acc, value) => {
      return value.isTouched && value.isValid && acc ? true : false
    }, true)
  }

  console.log(createUser.firstName.isValid);
  console.log(!/[0-9]/.test(createUser.firstName.value));
  console.log(errorValidationMessage);

  const renderError = (prop) => {
    return createUser[prop].isTouched ? userValidation[prop]
    .map(fn => fn(createUser[prop].value))
    .filter( x => typeof x === 'string')
    .map( (err, index) => <p key={index} style={{color: 'red'}}>{err}</p>) : null
  };

  const toggleEmailAndUsername = isPasswordChange ? null : (
    <>
      <Grid item xs={12}>
        <TextField
          variant="outlined"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          value={createUser.userName.value}
          error={!createUser.userName.isValid}
          onChange={(e) => updateState('userName', e.target.value.trim())}
        />
        {renderError('userName')}
      </Grid>
      <Grid item xs={12}>
        <TextField
          variant="outlined"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={createUser.email.value}
          error={!createUser.email.isValid}
          onChange={(e) => updateState('email', e.target.value.trim())}
        />
        {renderError('email')}
      </Grid>
    </>
  );

  return (
    <Container
      component="main"
      maxWidth="xs"
      style={{ backgroundImage: "./book.jpg" }}
    >
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar
          src={
            "https://i1.wp.com/geolok.eu/wp-content/uploads/2018/02/blue-planet-earth-rotation-with-space-background-4k-animation_ed3hfc3cl__F0000-min-min.jpg?fit=555%2C340"
          }
          className={classes.avatar}
        >
          {/* <LockOutlinedIcon /> */}
        </Avatar>
        <Typography component="h1" variant="h5">
          {isPasswordChange ? user.userName : "Sign up"}
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                value={createUser.firstName.value}
                error={!createUser.firstName.isValid}
                onChange={(e) => updateState('firstName', e.target.value.trim())}
              />
              {renderError('firstName')}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                value={createUser.lastName.value}
                error={!createUser.lastName.isValid}
                onChange={(e) => updateState('lastName', e.target.value.trim())}
              />
              {renderError('lastName')}
            </Grid>
            {toggleEmailAndUsername}
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={createUser.password.value}
                error={!createUser.password.isValid}
                onChange={(e) => updateState('password', e.target.value.trim())}
              />
              {renderError('password')}
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="Confirm password"
                label="Confirm password"
                type="password"
                id="confirm password"
                autoComplete="current-password"
                value={createUser.confirmPassword.value}
                error={!createUser.confirmPassword.isValid}
                onChange={(e) => updateState('confirmPassword', e.target.value.trim())}
              />
            </Grid>
            <Grid item xs={12}></Grid>
          </Grid>
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={isPasswordChange ? updateHandler : signInHandler}
            disabled={isDisable()}
          >
            {isPasswordChange ? "Update" : "Sign Up"}
          </Button>
          {/* <Grid container justify="flex-start">
              { props.location.pathname.includes('account/password') ? null : <Link href="/login" variant="body2">
                Forgotten password
              </Link>}
          </Grid> */}
          <Grid container>
            <Grid item xs></Grid>
            <Grid item>
              {isLoginPage ? null : (
                <Link
                  style={{ cursor: "pointer" }}
                  variant="body2"
                  onClick={(e) => (
                    e.preventDefault(), setIsLoginPage(!isLoginPage)
                  )}
                >
                  Already have an account?
                </Link>
              )}
            </Grid>
          </Grid>

          {/* <Grid container justify="flex-end">
            <Grid item>
              { props.location.pathname.includes('account/password') ? null : <Link href="/login" variant="body2">
                Already have an account?
              </Link>}
            </Grid>
          </Grid> */}
        </form>
      </div>
      <Box mt={3}></Box>
    </Container>
  );
};

export default withRouter(Register);
