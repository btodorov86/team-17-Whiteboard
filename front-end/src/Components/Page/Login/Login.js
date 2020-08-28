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
import { BASE_URL, exceptionStatus, isErrorResponse } from "../../../Constants/Constant";
import jwt from 'jwt-decode';
import AuthContext from '../../../Providers/Context/AuthContext';
import ExceptionContext from '../../../Providers/Context/ExceptionContext';

const Login = (props) => {

  const { setOpen } = useContext(ExceptionContext);

  const { user, setUser } = useContext(AuthContext);

  const isAdminPath = props.location.pathname.includes('admin');

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");

  const signInHandler = (e, obj) => {
    e.preventDefault();
    if (Object.values(obj).includes("")) {
      console.log("pls enter valid credentials");
    }

    fetch(`${BASE_URL}/session`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then((r) => r.json())
      .then((resp) => {
        isErrorResponse(resp)
        try {
          setUser(jwt(resp.token));
        } catch (err) {
          throw new Error(err.message)
        }

        localStorage.setItem("token", `Bearer ${resp.token}`);

        isAdminPath ? props.history.push('/admin/dashboard/books') : props.history.push('/books')


      })
      .catch((err) => setOpen({ value: true, msg: err.message, statusType: exceptionStatus.error}));
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
    },
    form: {
      width: "100%",
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));

  const classes = useStyles();

  const inputUserName = (
    <TextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      id="userName"
      label="Username"
      name="userName"
      autoComplete="userName"
      autoFocus
      value={userName}
      onChange={(e) => setUserName(e.target.value)}
    />
  );

  const toggleAdmin = isAdminPath
    ? inputUserName
    : null;

  const toggleObj = props.location.pathname.includes("login")
    ? { email, password }
    : { email, userName, password };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>{/* <LockOutlinedI /> */}</Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            error={false}
            onChange={(e) => setEmail(e.target.value)}
          />
          {toggleAdmin}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            // href="/login"
            onClick={(e) => signInHandler(e, toggleObj)}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
            </Grid>
            <Grid item>
              <Link  href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={21}>
      </Box>
    </Container>
  );
};

export default Login;
