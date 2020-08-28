import React, { useState, useContext } from "react";
import { TableRow, TableCell, TextField } from "@material-ui/core";
import propTypes from "prop-types";
import AdminDeleteBtn from "../../Buttons/AdminDeleteBtn";
import { withRouter } from "react-router-dom";
import AdminUpdateBtn from "../../Buttons/AdminUpdateBtn";
import { BASE_URL, isErrorResponse, exceptionMsg, exceptionStatus } from "../../../../../Constants/Constant";
import ThumbUp from "@material-ui/icons/ThumbUp"
import ThumbDown from "@material-ui/icons/ThumbDown"
import Favorite from "@material-ui/icons/Favorite"
import ExceptionContext from '../../../../../Providers/Context/ExceptionContext';

const AdminUpdateReviewContainer = ({ dataObj, onClickHandler, history }) => {

  const { setOpen } = useContext(ExceptionContext);

  const [isRed, setIsRed] = useState({
    like: null,
    dislike: null,
    love: null
  });

  const [sendData, setSendData] = useState({
    contents: dataObj.contents,
    reactions: {
        reactionValue: ''                                   // "Like", 'Dislike', 'Love'
    }
  });


  let num = 900;

  const updateContent = () => {
    let URL = `${BASE_URL}/reviews/${dataObj.id}`;

    const updateObj = {
        contents: sendData.contents === "" ? dataObj.contents : sendData.contents,
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
        setOpen({ value: true, msg: exceptionMsg.success, statusType: exceptionStatus.success})
        history.goBack();
      })
      .catch((err) => setOpen({ value: true, msg: err.message, statusType: exceptionStatus.error}));
  };

  const updateReaction = () => {
    let URL = `${BASE_URL}/reactions/books/reviews/${dataObj.id}`;

    const updateObj = {
        reactionValue: sendData.reactions.reactionValue,
      };

    fetch(URL, {
      method: "POST",
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
      .catch((err) => setOpen({ value: true, msg: err.message, statusType: exceptionStatus.error}));
  };

  const partialUpdate = () => {

      if (sendData.contents !== dataObj.contents) {
        if (sendData.reactions.reactionValue.length !== 0) {
            updateContent();
            updateReaction();
        } else {
            updateContent();
        }
      } else {
        if (sendData.reactions.reactionValue.length !== 0) {
            updateReaction();
        } else {
            return
        }
      }
  }

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
    <TableRow key={`admin-update-review-container-row-${num++}`}>
      <TableCell key={`admin-update-review-container-cell-${num++}`}>
        {dataObj.id}
      </TableCell>
      <TableCell key={`admin-update-review-container-cell-${num++}`}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="update-update-review-contents"
          label="Contents"
          name="contents"
          autoComplete="contents"
          autoFocus
          value={sendData.contents}
          error={false}
          onChange={(e) => setSendData({ ...sendData, contents: e.target.value })}
        />
      </TableCell>
      <TableCell>
      <>
      <ThumbUp style={{cursor: 'pointer'}, isRed.like} onClick={() => (changeState('like'), setSendData({...sendData, reactions: { reactionValue: "Like"}}))} button />
      <ThumbDown style={{cursor: 'pointer'}, isRed.dislike}  onClick={() => (changeState('dislike'), setSendData({...sendData, reactions: { reactionValue: "Dislike"}}))} button />
      <Favorite style={{cursor: 'pointer'}, isRed.love} onClick={() => (changeState('love'), setSendData({...sendData, reactions: { reactionValue: "Love"}}))} button />
      </>
      </TableCell>
      <TableCell key={`admin-update-review-container-cell-${num++}`}>
        {typeof dataObj?.reaction === "object" ? dataObj.reaction.like : 0}
      </TableCell>
      <TableCell key={`admin-update-review-container-cell-${num++}`}>
        {typeof dataObj?.reaction === "object" ? dataObj.reaction.dislike : 0}
      </TableCell>
      <TableCell key={`admin-update-review-container-cell-${num++}`}>
        {typeof dataObj?.reaction === "object" ? dataObj.reaction.love : 0}
      </TableCell>
      <TableCell>
        <AdminUpdateBtn onClickHandler={partialUpdate} />
      </TableCell>
      <TableCell>
        <AdminDeleteBtn
          onClickHandler={onClickHandler("reviews")}
          id={dataObj.id}
        />
      </TableCell>
    </TableRow>
  );
};

AdminUpdateReviewContainer.propTypes = {
  dataObj: propTypes.object.isRequired,
  onClickHandler: propTypes.func.isRequired,
};

export default withRouter(AdminUpdateReviewContainer);
