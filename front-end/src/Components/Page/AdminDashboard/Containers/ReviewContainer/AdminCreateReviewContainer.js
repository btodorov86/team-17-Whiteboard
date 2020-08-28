import React, { useState, useContext } from "react";
import { TableRow, TableCell, TextField, Button } from "@material-ui/core";
import propTypes from "prop-types";
import { withRouter } from 'react-router-dom';
import { BASE_URL, isErrorResponse, exceptionMsg, exceptionStatus } from '../../../../../Constants/Constant';
import ExceptionContext from '../../../../../Providers/Context/ExceptionContext';

const AdminCreateReviewContainer = ({ history }) => {

  const { setOpen } = useContext(ExceptionContext)

  const [review, setReview] = useState({
    contents: "",
    // img:
  });
  const [bookId, setBookId] = useState('');

  const createHandler = (createObj) => {

    if (!bookId.length === 0 || !review.contents.length) {
      setOpen({value: true, msg: "Enter book ID and contents", statusType: exceptionStatus.error})
      return
    }

    let URL = `${BASE_URL}/reviews/books/${bookId}`;

    fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(createObj),
    })
      .then((r) => r.json())
      .then((resp) => {
        isErrorResponse(resp);
        setOpen({value: true, msg: exceptionMsg.success, statusType: exceptionStatus.success})
        history.goBack();
      })
      .catch((err) => setOpen({value: true, msg: err.message, statusType: exceptionStatus.error}));
  };

  return (
    <TableRow>
      <TableCell key={`table-cell-create-review-bookId`}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="create-review-bookId"
          label="Book Id"
          name="book Id"
          autoComplete="book Id"
          autoFocus
          value={review.bookId}
          error={false}
          onChange={(e) => setBookId(e.target.value )}
        />
      </TableCell>
      <TableCell key={`table-cell-create-review-contents1`}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="create-review-contents"
          label="Contents"
          name="contents"
          autoComplete="contents"
          // autoFocus
          value={review.contents}
          error={false}
          onChange={(e) => setReview({ ...review, contents: e.target.value })}
        />
      </TableCell>
      <TableCell key={`table-cell-create-review-contents2`}>
        <Button size="small" variant="contained" color="primary"
          onClick={ (e) => (e.preventDefault(), createHandler(review))}
        >
          Create
        </Button>
      </TableCell>
        <TableCell key={`table-cell-create-review-contents3`}>
          <Button size="small" variant="outlined" color="primary"
          onClick={() => history.goBack()}>Cancel</Button>
        </TableCell>
    </TableRow>
  );
};

AdminCreateReviewContainer.propTypes = {
  createHandler: propTypes.func.isRequired,
  // onClickParam: propTypes.string.isRequired,
  history: propTypes.object.isRequired,
};

export default withRouter(AdminCreateReviewContainer);
