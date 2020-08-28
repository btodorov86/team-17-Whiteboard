import React, { useState, useContext } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { BASE_URL, isErrorResponse, exceptionStatus } from '../../../Constants/Constant';
import { withRouter } from 'react-router-dom';
import AuthContext from '../../../Providers/Context/AuthContext';
import ExceptionContext from '../../../Providers/Context/ExceptionContext';

const Register = (props) => {

  const { user } = useContext(AuthContext);

  const { setOpen } = useContext(ExceptionContext);

  const [ createUser, setCreateUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    userName: '',
    password: ''
  })

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
          props.history.goBack();
        })
        .catch((err) => setOpen({ value: true, msg: err.message, statusType: exceptionStatus.error}))
    };


  const signInHandler = (e) => {
    e.preventDefault();
    if (Object.values(createUser).includes('')) {
      setOpen({ value: true, msg: 'You have missed input field', statusType: exceptionStatus.info})
    }

    fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(createUser)
    })
    .then( r => r.json())
    .then( resp => {
      if (resp.error) {
        isErrorResponse(resp)
      }

      props.history.push('/login')

    })
    .catch( err => setOpen({ value: true, msg: err.message, statusType: exceptionStatus.error}))

  }

  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));

  const classes = useStyles();

  const toggleEmailAndUsername = props.location.pathname.includes('account/password') ? null : <><Grid item xs={12}>
  <TextField
    variant="outlined"
    required
    fullWidth
    id="username"
    label="Username"
    name="username"
    autoComplete="username"
    value={createUser.userName}
    onChange={(e) => setCreateUser({...createUser, userName: e.target.value})}
  />
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
    value={createUser.email}
    onChange={(e) => setCreateUser({...createUser, email: e.target.value})}
  />
</Grid>
</>

  return (
    <Container component="main" maxWidth="xs" style={{backgroundImage: './book.jpg'}}>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          {/* <LockOutlinedIcon /> */}
        </Avatar>
        <Typography component="h1" variant="h5">
          { props.location.pathname.includes('account/password') ? user.userName : 'Sign up' }
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
                value={createUser.firstName}
                onChange={(e) => setCreateUser({...createUser, firstName: e.target.value})}
              />
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
                value={createUser.lastName}
                onChange={(e) => setCreateUser({...createUser, lastName: e.target.value})}
              />
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
                value={createUser.password}
                onChange={(e) => setCreateUser({...createUser, password: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
            </Grid>
          </Grid>
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={props.location.pathname.includes('account/password') ? updateHandler : signInHandler}
          >
            {props.location.pathname.includes('account/password') ? 'Update' : 'Sign Up'}
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              { props.location.pathname.includes('account/password') ? null : <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>}
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={3}></Box>
    </Container>
  );
};

export default withRouter(Register)
