import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Reactions from '../Reaction/Reaction';
import CreateReview from './CreateReview';
import AuthContext from '../../../Providers/Context/AuthContext';
import AdminUpdateBtn from '../../Page/AdminDashboard/Buttons/AdminUpdateBtn'
import AdminDeleteBtn from '../../Page/AdminDashboard/Buttons/AdminDeleteBtn'
import UpdateReview from './UpdateReview';
import { BASE_URL, isErrorResponse, exceptionStatus } from '../../../Constants/Constant';
import ExceptionContext from '../../../Providers/Context/ExceptionContext';




const Reviews = ({ reviews, render, setRender, returningUsers }) => {

  const { setOpen } = useContext(ExceptionContext)

  const [modalOpen, setModalOpen] = React.useState(false);

  const handleOpen = () => {
    setModalOpen(true);
  };
  const { user } = useContext(AuthContext)

  const useStyles = makeStyles((theme) => ({
    text: {
      padding: theme.spacing(2, 2, 0),
    },
    paper: {
      paddingBottom: 50,
    },
    list: {
      marginBottom: theme.spacing(2),
    },
    subheader: {
      backgroundColor: theme.palette.background.paper,
    },
    appBar: {
      top: 'auto',
      bottom: 0,
    },
    grow: {
      flexGrow: 1,
    },
    fabButton: {
      position: 'absolute',
      zIndex: 1,
      top: -30,
      left: 0,
      right: 0,
      margin: 'auto',
    },
  }));

  const deleteReview = (id) => {

    fetch(`${BASE_URL}/reviews/${id}`, {
      method: 'DELETE',
      headers: {
        "Authorization": localStorage.getItem('token')
      }
    })
    .then( r => r.text())
    .then( resp => {
      isErrorResponse(resp);
      setRender(!render);
      setOpen({ value: true, msg: resp, statusType: exceptionStatus.success})
    })
    .catch( err => setOpen({ value: true, msg: err.message}))

  }

  const classes = useStyles();

  console.log(reviews);

  return (
    <React.Fragment>
      <CssBaseline />
      <Paper square className={classes.paper}>
        <Typography className={classes.text} variant="h5" gutterBottom>
          Reviews
        </Typography>
        <List className={classes.list}>
          {reviews.map(({ id, contents, reaction, author }) => (
            <React.Fragment key={id}>
              <ListItem button>
                <ListItemAvatar>
                  <Avatar alt="Profile Picture" src={`${BASE_URL}/${author.avatarURL}`} />
          {/* <p>{`${BASE_URL}/${author.avatarURL}`}</p> */}
                </ListItemAvatar>
                <ListItemText primary={author.userName} secondary={contents} />
                <Reactions reaction={reaction} id={id} render={render} setRender={setRender} />
              </ListItem>
              { modalOpen ? <UpdateReview modalOpen={modalOpen} setModalOpen={setModalOpen} render={render} setRender={setRender} hidden={false} id={id} /> : null }
              { author.id === user.id ? <><AdminUpdateBtn onClickHandler={handleOpen} /><AdminDeleteBtn onClickHandler={deleteReview} id={id} /></> : null }
            </React.Fragment>
          ))}
          <br></br>
          {returningUsers.find( x => x.id === user.id) && !reviews.find( x => x.author.id === user.id) ? <CreateReview render={render} setRender={setRender}/> : null}
          {/* <Fab color="secondary" aria-label="add" className={classes.fabButton}>
            <AddIcon />
          </Fab> */}
        </List>
      </Paper>
      {/* <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="open drawer">
            <MenuIcon />
          </IconButton>
          <Fab color="secondary" aria-label="add" className={classes.fabButton}>
            <AddIcon />
          </Fab>
          <div className={classes.grow} />
          <IconButton color="inherit">
            <SearchIcon />
          </IconButton>
          <IconButton edge="end" color="inherit">
            <MoreIcon />
          </IconButton>
        </Toolbar>
      </AppBar> */}
    </React.Fragment>
  );
};

export default Reviews
