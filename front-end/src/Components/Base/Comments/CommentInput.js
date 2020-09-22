import { makeStyles, TextField } from "@material-ui/core";
import React, { useContext, useState } from "react";
import Grid from "@material-ui/core/Grid";
import { BASE_URL, exceptionStatus, isErrorResponse } from '../../../Constants/Constant';
import ExceptionContext from '../../../Providers/Context/ExceptionContext';
import { withRouter } from 'react-router-dom';

const CommentInput = ({ isAddComment, setComments, history, match, setIsAddComment, isDrawShape }) => {

  const { setOpen } = useContext(ExceptionContext);

  const [comment, setComment] = useState({
      text: '',
  });
  const useStyles = makeStyles((theme) => ({
    root: {
      position: "absolute",
      top: isAddComment.y,
      left: isAddComment.x,
      width: 220,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.secondary,
      "& svg": {
        margin: theme.spacing(0.9),
      },
      "& hr": {
        margin: theme.spacing(0, 0.5),
      },
    },
    text: {
      border: `1px solid ${theme.palette.divider}`,
    },
    select: {
        border: '1px solid blue'
    }
  }));

  const submit = () => {
    const sendObj = {
        text: comment.text,
        y: isAddComment.x,
        x: isAddComment.y,
    }
    console.log(sendObj);

      fetch(`${BASE_URL}/whiteboards/${match.params.id}/comments`, {
          method: 'POST',
        headers: {
          Authorization: localStorage.getItem("token"),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendObj)
      })
        .then((r) => (r.status >= 500 ? history.push("/servererror") : r.json()))
        .then((resp) => {
          isErrorResponse(resp);
          setComments(prev => [...prev, resp]);
          isDrawShape(resp);
        })
        .catch((err) =>
          setOpen({
            value: true,
            msg: err.message,
            statusType: exceptionStatus.error,
          })
        )
        .finally(() => setIsAddComment(prev => ({...prev, isActive: false})))
  }

  const classes = useStyles();

  return (
    <div hidden={!isAddComment.isActive} className={classes.root} >
      <Grid container alignItems="center" >
        <TextField
          fullWidth
          variant="outlined"
          className={classes.text}
          value={comment.text}
          autoFocus
          onChange={(e) => setComment({text: e.target.value})}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              submit()
            }
          }}
        />
      </Grid>
    </div>
  );
};

export default withRouter(CommentInput);
