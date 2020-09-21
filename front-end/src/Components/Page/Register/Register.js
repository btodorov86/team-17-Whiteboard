import React, { useState, useContext } from "react";
import images from "./../Home/earth.PNG";
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
import ExceptionContext from "../../../Providers/Context/ExceptionContext";
import propTypes from "prop-types";

const Register = ({ isLoginPage, setIsLoginPage, history }) => {
  const { setOpen } = useContext(ExceptionContext);
  const [registrationPage, setRegistrationPage] = useState(0);
  const [files, setFiles] = useState([]);
  const pageNumberNames = [
    "firstName",
    "avatar",
    "lastName",
    "userName",
    "email",
    "password",
    "confirmPassword",
  ];

  const [createUser, setCreateUser] = useState({
    firstName: {
      isValid: true,
      isTouched: false,
      value: "",
    },
    avatar: {
      isValid: true,
      isTouched: false,
      value: [],
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
    },
  });
  const useStyles = makeStyles((theme) => ({
    notchedOutline: {
      borderWidth: "1px",
      borderColor: "#6fa241 !important"
    },
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

  const updateState = (prop, value) => {
    setCreateUser({
      ...createUser,
      [prop]: {
        isTouched: true,
        value,
        isValid: prop !== 'avatar' ? userValidation[prop].reduce(
          (acc, validateFn) => acc && typeof validateFn(value) === "boolean",
          true
        ) : true,
      },
    });
  };

  const userValidation = {
    firstName: [
      (data) => data?.length > 0 || "First name field is empty",
      (data) => !/[0-9]/.test(data) || "First name can't include digit",
    ],
    avatar: [
      (data) => data.length || "Please upload avatar !",
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
        /^[a-zA-Z0-9]{6,16}$/.test(data) ||
        "User name must have 6 to 16 characters",
    ],
    password: [
      (data) =>
        /^[a-zA-Z0-9]{6,16}$/.test(data) ||
        "Password must have 6 to 16 characters",
      (data) => /\d/.test(data) || "Password must contain minimum 1 digit",
      (data) =>
        /[A-Z]/.test(data) ||
        "Password must contain minimum 1 upper case alphabet",
    ],
    confirmPassword: [
      (data) => createUser.password.value === data || "Password not match",
    ],
  };

  const uploadFiles = (id) => {

    const formData = new FormData();
    if (!createUser.avatar.value.length) {
      return;
    }

    formData.append('files', createUser.avatar.value[0]);

    fetch(`${BASE_URL}/users/${id}/avatar`, {
        method: 'POST',
        headers: {
            "Authorization": localStorage.getItem('token'),
        },
        body: formData
    })
    .then( r => r.json())
    .then( resp => {
        isErrorResponse(resp);
        setOpen({
          value: true,
          msg: "Successes registration!",
          statusType: exceptionStatus.success,
        });
        setIsLoginPage(!isLoginPage);
    })
    .catch( err => setOpen({ value: true, msg: err.message, statusType: exceptionStatus.error}))
  }

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
     .then((r) => r.status >= 500 ? history.push('/servererror') : r.json())
      .then((resp) => {
        isErrorResponse(resp);
        uploadFiles(resp.id);
      })
      .catch((err) =>
        setOpen({
          value: true,
          msg: err.message,
          statusType: exceptionStatus.error,
        })
      )
  };

  const isDisable = () => {
    return !Object.values(createUser).reduce((acc, value) => {
      return value.isTouched && value.isValid && acc ? true : false;
    }, true);
  };

  const SingleDisable = (fieldName) => {
    return createUser[fieldName].isValid && createUser[fieldName].isTouched
      ? false
      : true;
  };

  const renderError = (prop) => {
    return createUser[prop].isTouched
      ? userValidation[prop]
          .map((fn) => fn(createUser[prop].value))
          .filter((x) => typeof x === "string")
          .map((err, index) => (
            <p key={index} style={{ color: "red" }}>
              {err}
            </p>
          ))
      : null;
  };

  const registrationFields = [
    <Grid item xs={12}>
      <TextField
        autoComplete="fname"
        name="firstName"
        variant="outlined"
        required
        fullWidth
        InputProps={{
          classes: {
            notchedOutline: classes.notchedOutline
          }
        }}
        id="firstName"
        label="First Name"
        autoFocus
        value={createUser.firstName.value}
        error={!createUser.firstName.isValid}
        onChange={(e) => updateState("firstName", e.target.value.trim())}
      />
      {renderError("firstName")}
    </Grid>,
    <Grid item xs={12}>
      <input
        accept="image/*"
        // className={classes.input}
        style={{ display: "none" }}
        id="raised-button-file"
        multiple
        type="file"
        onChange={(e) => updateState('avatar', Array.from(e.target.files))}
      />
      <label htmlFor="raised-button-file">
        <Button
          variant="outlined"
          component="span"
          fullWidth
          className={classes.submit}
        >
          Upload Avatar
        </Button>
      </label>
    </Grid>,
    <Grid item xs={12}>
      <TextField
        variant="outlined"
        required
        fullWidth
        InputProps={{
          classes: {
            notchedOutline: classes.notchedOutline
          }
        }}
        id="lastName"
        label="Last Name"
        name="lastName"
        autoComplete="lname"
        value={createUser.lastName.value}
        error={!createUser.lastName.isValid}
        onChange={(e) => updateState("lastName", e.target.value.trim())}
      />
      {renderError("lastName")}
    </Grid>,
    <Grid item xs={12}>
      <TextField
        variant="outlined"
        required
        fullWidth
        InputProps={{
          classes: {
            notchedOutline: classes.notchedOutline
          }
        }}
        id="username"
        label="Username"
        name="username"
        autoComplete="username"
        value={createUser.userName.value}
        error={!createUser.userName.isValid}
        onChange={(e) => updateState("userName", e.target.value.trim())}
      />
      {renderError("userName")}
    </Grid>,
    <Grid item xs={12}>
      <TextField
        variant="outlined"
        required
        fullWidth
        InputProps={{
          classes: {
            notchedOutline: classes.notchedOutline
          }
        }}
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        value={createUser.email.value}
        error={!createUser.email.isValid}
        onChange={(e) => updateState("email", e.target.value.trim())}
      />
      {renderError("email")}
    </Grid>,
    <>
      <Grid item xs={12}>
        <TextField
          variant="outlined"
          required
          fullWidth
          InputProps={{
            classes: {
              notchedOutline: classes.notchedOutline
            }
          }}
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={createUser.password.value}
          error={!createUser.password.isValid}
          onChange={(e) => updateState("password", e.target.value.trim())}
        />
        {renderError("password")}
      </Grid>
      <Grid item xs={12}>
        <TextField
          variant="outlined"
          required
          fullWidth
          InputProps={{
            classes: {
              notchedOutline: classes.notchedOutline
            }
          }}
          name="Confirm password"
          label="Confirm password"
          type="password"
          id="confirm password"
          autoComplete="current-password"
          value={createUser.confirmPassword.value}
          error={!createUser.confirmPassword.isValid}
          onChange={(e) =>
            updateState("confirmPassword", e.target.value.trim())
          }
        />
      </Grid>
    </>,
  ];

  const toggleButtons =
    registrationFields.length - 1 > registrationPage ? (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            style={{backgroundColor: '#6fa241'}}
            onClick={(e) => {
              e.preventDefault();
              backHandler();
            }}
            disabled={registrationPage === 0}
          >
            Back
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            style={{backgroundColor: '#6fa241'}}
            onClick={(e) => {
              e.preventDefault();
              nextHandler();
            }}
            disabled={SingleDisable(pageNumberNames[registrationPage])}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    ) : (
      <Grid item xs={12}>
        <Button
          type="button"
          fullWidth
          variant="contained"
          color="primary"
          style={{backgroundColor: '#6fa241'}}
          className={classes.submit}
          onClick={signInHandler}
          disabled={isDisable()}
        >
          Sign Up
        </Button>
        <Button
          type="button"
          fullWidth
          variant="contained"
          color="primary"
          style={{backgroundColor: '#6fa241'}}
          onClick={(e) => {
            e.preventDefault();
            backHandler();
          }}
        >
          Back
        </Button>
      </Grid>
    );

  const nextHandler = () => {
    setRegistrationPage(registrationPage + 1);
  };
  const backHandler = () => {
    setRegistrationPage(registrationPage - 1);
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      style={{ backgroundImage: "./book.jpg" }}
    >
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar
          src={images}
          className={classes.avatar}
        >
          {/* <LockOutlinedIcon /> */}
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            {registrationFields[registrationPage]}
          </Grid>
          {toggleButtons}
          <Grid container>
            <Grid item xs></Grid>
            <Grid item>
              {isLoginPage ? null : (
                <Link
                  style={{ cursor: "pointer" }}
                  variant="body2"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsLoginPage(!isLoginPage);
                  }}
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

Register.propTypes = {
  isLoginPage: propTypes.bool.isRequired,
  setIsLoginPage: propTypes.func.isRequired,
};

export default Register;
