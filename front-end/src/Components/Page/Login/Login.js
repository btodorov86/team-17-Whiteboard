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
import { withRouter } from 'react-router-dom';
import nodemailer from 'nodemailer';

const Login = ({ history, setIsLoginPage, isLoginPage }) => {

  const { setOpen } = useContext(ExceptionContext);

  const { setUser } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordReset, setIsPasswordReset] = useState(false)

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

  const resetPasswordHandler = (e, email) => {
    e.preventDefault();
    console.log(111111)
    fetch(`${BASE_URL}/recover`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({email: email}),
    })
    .then((r) => r.text())
    .then(res => console.log(res))
    .catch((err) => setOpen({ value: true, msg: err.message, statusType: exceptionStatus.error}));
  }
// // async..await is not allowed in global scope, must use a wrapper
// async function main() {
//   // Generate test SMTP service account from ethereal.email
//   // Only needed if you don't have a real mail account for testing
//   let testAccount = await nodemailer.createTestAccount();

//   // create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: testAccount.user, // generated ethereal user
//       pass: testAccount.pass, // generated ethereal password
//     },
//   });

//   // send mail with defined transport object
//   let info = await transporter.sendMail({
//     from: '"Fred Foo 👻" <foo@example.com>', // sender address
//     to: "bar@example.com, baz@example.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
//   });

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//   // Preview only available when sending through an Ethereal account
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
// }

// main().catch(console.error);



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
  console.log(isPasswordReset)
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar src={'https://i1.wp.com/geolok.eu/wp-content/uploads/2018/02/blue-planet-earth-rotation-with-space-background-4k-animation_ed3hfc3cl__F0000-min-min.jpg?fit=555%2C340'} className={classes.avatar}>{/* <LockOutlinedI /> */}</Avatar>
        <Typography component="h1" variant="h5">
          {/* { location.pathname.includes('password/reset') ? "Password recovery" : "Sign in" } */}
          { isPasswordReset ? "Password recovery" : "Sign in" }
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
         {/* { location.pathname.includes('password/reset') ? null : <TextField */}
         { isPasswordReset ? null : <TextField
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
            // fullWidth={!location.pathname.includes('password/reset')}
            fullWidth={!isPasswordReset}
            variant="contained"
            color="primary"
            // className={location.pathname.includes('password/reset') ? classes.resetPassLeftBtn : classes.submit}
            className={isPasswordReset ? classes.resetPassLeftBtn : classes.submit}
            // href="/login"
            // onClick={(e) => location.pathname.includes('password/reset') ? resetPasswordHandler(e) : signInHandler(e, { email, password }) }
            onClick={(e) => isPasswordReset ? resetPasswordHandler(e, email) : signInHandler(e, { email, password }) }
          >
            {/* { location.pathname.includes('password/reset') ? 'Reset password' : 'Sign In' } */}
            { isPasswordReset ? 'Reset password' : 'Sign In' }
          </Button>
          {/* { location.pathname.includes('password/reset') ? <Button */}
          { isPasswordReset ? <Button
            type="button"
            fullWidth={!isPasswordReset}
            // fullWidth={!location.pathname.includes('password/reset')}
            variant="contained"
            color="primary"
            // className={location.pathname.includes('password/reset') ? classes.resetPassRightBtn : classes.submit}
            className={isPasswordReset ? classes.resetPassRightBtn : classes.submit}
            onClick={(e) => (e.preventDefault(), setIsPasswordReset(!isPasswordReset))}
            style={{cursor: 'pointer'}}
          >
            Back
          </Button> : null }
          <Grid container>
            <Grid item xs>
            <Link style={{cursor: 'pointer'}} variant="body2" onClick={(e) => (e.preventDefault(), setIsPasswordReset(!isPasswordReset))}>
                {/* { location.pathname.includes('password/reset') ? null : "Forgot password?" } */}
                { isPasswordReset ? null : "Forgot password?" }
               </Link>
            </Grid>
            <Grid item>
              <Link  style={{cursor: 'pointer'}} variant="body2" onClick={(e) => (e.preventDefault(), setIsLoginPage(!isLoginPage))}>
               {/* { location.pathname.includes('password/reset') ? null : "Don't have an account? Sign Up" } */}
               { isPasswordReset ? null : "Don't have an account? Sign Up" }
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
