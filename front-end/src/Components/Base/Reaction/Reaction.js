import React, { useState, useContext } from "react";
import ThumbUp from "@material-ui/icons/ThumbUp";
import ThumbDown from "@material-ui/icons/ThumbDown";
import Favorite from "@material-ui/icons/Favorite";
import { BASE_URL, isErrorResponse, exceptionStatus } from '../../../Constants/Constant';
import ExceptionContext from '../../../Providers/Context/ExceptionContext';

const Reactions = ({ reaction, id, setRender, render }) => {

  const { setOpen } = useContext(ExceptionContext);

  const [isRed, setIsRed] = useState({
    like: null,
    dislike: null,
    love: null
  });

  const updateReaction = (reaction) => {
    let URL = `${BASE_URL}/reactions/books/reviews/${id}`;

    fetch(URL, {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reactionValue: `${reaction}`}),
    })
      .then((r) => r.json())
      .then((resp) => {
        isErrorResponse(resp);
        setRender(!render)
        // history.goBack();
      })
      .catch((err) => setOpen({ value: true, msg: err.message, statusType: exceptionStatus.error}));
  };

  const changeState = (param) => {
    Object.keys(isRed).filter( x => x !== param).map( c => setIsRed({...isRed}, isRed[c] = null ));

    if (isRed[param] === null) {
      const b = {...isRed};
      b[param] = {color: 'red'}
      setIsRed(b)
    } else {
      const b = {...isRed};
      b[param] = null
      setIsRed(b)
    }
  }


  return (
    <>
      <ThumbUp style={{ cursor: "pointer" }, isRed.like} onClick={() => (changeState('like'), updateReaction('Like'))} />
      <span style={{ padding: '2px'}}>{reaction.like}</span>
      <ThumbDown style={{ cursor: "pointer" }, isRed.dislike} onClick={() => (changeState('dislike'), updateReaction('Dislike'))} />
      <span style={{ padding: '2px'}}>{reaction.dislike}</span>
      <Favorite style={{ cursor: "pointer" }, isRed.love} onClick={() => (changeState('love'), updateReaction('Love'))} />
      <span style={{ padding: '2px'}}>{reaction.love}</span>
    </>
  );
};

export default Reactions;
