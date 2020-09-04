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
import { Modal } from '@material-ui/core';
import { withRouter } from 'react-router-dom';

const Login = ({ history, location }) => {

  const { setOpen } = useContext(ExceptionContext);

  const { setUser } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

        history.push('/profile')


      })
      .catch((err) => setOpen({ value: true, msg: err.message, statusType: exceptionStatus.error}));
  };

  const resetPasswordHandler = (e) => {
    // send mail to user with new password
  }


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
      height: '80px',
      width: '80px'
    },
    form: {
      width: "100%",
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    resetPassRightBtn: {
      width: '49%',
      marginLeft: '2%',
      margin: theme.spacing(3, 0, 2),
    },
    resetPassLeftBtn: {
      width: '49%',
      margin: theme.spacing(3, 0, 2),
    }
  }));

  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar src={'https://i1.wp.com/geolok.eu/wp-content/uploads/2018/02/blue-planet-earth-rotation-with-space-background-4k-animation_ed3hfc3cl__F0000-min-min.jpg?fit=555%2C340'} className={classes.avatar}>{/* <LockOutlinedI /> */}</Avatar>
        <Typography component="h1" variant="h5">
          { location.pathname.includes('password/reset') ? "Password recovery" : "Sign in" }
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
         { location.pathname.includes('password/reset') ? null : <TextField
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
          /> }
          <Button
            type="button"
            fullWidth={!location.pathname.includes('password/reset')}
            variant="contained"
            color="primary"
            className={location.pathname.includes('password/reset') ? classes.resetPassLeftBtn : classes.submit}
            // href="/login"
            onClick={(e) => location.pathname.includes('password/reset') ? resetPasswordHandler(e) : signInHandler(e, { email, password }) }
          >
            { location.pathname.includes('password/reset') ? 'Reset password' : 'Sign In' }
          </Button>
          { location.pathname.includes('password/reset') ? <Button
            type="button"
            fullWidth={!location.pathname.includes('password/reset')}
            variant="contained"
            color="primary"
            className={location.pathname.includes('password/reset') ? classes.resetPassRightBtn : classes.submit}
            href="/login"
            onClick={(e) => history.goBack()}
          >
            Back
          </Button> : null }
          <Grid container>
            <Grid item xs>
            <Link href="/password/reset" variant="body2">
                { location.pathname.includes('password/reset') ? null : "Forgot password?" }
               </Link>
            </Grid>
            <Grid item>
              <Link  href="/register" variant="body2">
               { location.pathname.includes('password/reset') ? null : "Don't have an account? Sign Up" }
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

export default withRouter(Login);
