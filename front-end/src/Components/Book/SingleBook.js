import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SimpleRating from "../Base/Rating/Rating";
import ReadOnlySimpleRating from "../Base/Rating/ReadOnlyRating";
import LayersIcon from "@material-ui/icons/Layers";
import Reviews from "../Base/Review/Review";
import { BASE_URL, exceptionStatus } from "../../Constants/Constant";
import { isErrorResponse } from "../../Constants/Constant";
import ModalBtn from "../Page/AdminDashboard/Buttons/ModalBtn";
import AuthContext from "../../Providers/Context/AuthContext";
import Button from '@material-ui/core/Button'
import ExceptionContext from '../../Providers/Context/ExceptionContext';
import LoadingContext from '../../Providers/Context/LoadingContext';
import Loading from '../Page/Loading/Loading';

const SingleBook = ({ match }) => {
  const { user } = useContext(AuthContext);

  const { setOpen } = useContext(ExceptionContext);

  const { loading, setLoading } = useContext(LoadingContext);

  const [render, setRender] = useState(true);

  const [book, setBook] = useState({
    id: "",
    header: "",
    author: "",
    contents: "",
    borrowingUsers: [],
    returningUsers: [],
    bookReviews: [],
    bookRating: {
      ratingValue: null,
      userId: [],
    },
  });
  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/books/${match.params.id}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((r) => r.json())
      .then((resp) => {
        isErrorResponse(resp);
        setBook(resp);
      })
      .catch(err => setOpen({ value: true, msg: err.message, statusType: exceptionStatus.error}))
      .finally(() => setLoading(false))
  }, [match.params.id, render]);

  const useStyles = makeStyles((theme) => ({
    root: {
      marginTop: "30px",
      maxWidth: 600,
      margin: "auto",
    },
    media: {
      height: 0,
      paddingTop: "76.25%",
      width: '50%',
      marginLeft: 'auto',
      marginRight: 'auto',
    },

    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: "rotate(180deg)",
    },
    avatar: {
      backgroundColor: red[500],
    },
  }));
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const borrow = () => {
    fetch(`${BASE_URL}/books/${book.id}/borrow`, {
      method: "PUT",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((r) => r.text())
      .then((resp) => {
        isErrorResponse(resp);
        setRender(!render);
      })
      .catch((err) => setOpen({ value: true, msg: err.message, statusType: exceptionStatus.error}));
  };

  const returnBook = () => {
    fetch(`${BASE_URL}/books/${book.id}/return`, {
      method: "PUT",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((r) => r.text())
      .then((resp) => {
        isErrorResponse(resp);
        setRender(!render);
      })
      .catch((err) => setOpen({ value: true, msg: err.message, statusType: exceptionStatus.error}));
  };

  const toggleIsBorrowed = book.borrowingUsers.some((x) => x.id === user.id) ? (
    <div style={{display: 'flex'}}>
      <ModalBtn contents={book.contents}/>
      <Button style={{marginLeft: '4px'}} size='small' variant="contained" color="primary" onClick={(e) => (e.preventDefault(), returnBook())}>
        Return
      </Button>
    </div>
  ) : (
    <Button size='small' variant="contained" color="primary" onClick={(e) => (e.preventDefault(), borrow())}>Borrow</Button>
  );

  const toggleRating = () => {
    if (book.returningUsers.find( x => x.id === user.id) && !book.bookRating.userId.find( x => x === user.id)) {
      return <SimpleRating id={book.id} setRender={setRender} render={render} />;
    } else {
      return null;
    }
  };

  return (
    <>
    { loading ? <Loading /> : null}
    <Card className={classes.root}>
      <CardHeader
        avatar={<LayersIcon />}
        action={toggleIsBorrowed}
        title={book.header}
        subheader={book.author}
      />
      <CardMedia
        className={classes.media}
        image={`${BASE_URL}/${book.bookCover}`}
        title={book.header}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
        {book.contents.slice(0,40) + '...'}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <div>
          {toggleRating()}
        </div>
        <hr />
        <div>
          <ReadOnlySimpleRating rating={book.bookRating} />
        </div>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Reviews reviews={book.bookReviews} render={render} setRender={setRender} returningUsers={book.returningUsers} />
        </CardContent>
      </Collapse>
    </Card>
    </>
  );
};

export default SingleBook;
