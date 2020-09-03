import React, { useState, useContext } from "react";
import { TableRow, TableCell, TextField, Button } from "@material-ui/core";
import propTypes from "prop-types";
import { withRouter } from 'react-router-dom';
import { BASE_URL, isErrorResponse, exceptionMsg, exceptionStatus } from '../../../../../Constants/Constant';
import ExceptionContext from '../../../../../Providers/Context/ExceptionContext';
// import FormFileInput from 'react-bootstrap/esm/FormFileInput';

const AdminCreateBookContainer = ({ history }) => {

  const { setOpen } = useContext(ExceptionContext)

  const [book, setBook] = useState({
    header: "",
    author: "",
    contents: "",
    // img:
  });

  const [files, setFiles] = useState([]);

  const [createdBookId, setCreatedBookId] = useState('')

  const createHandler = () => {
    if (!book.header.length || !book.author.length || !book.contents.length || !files.length) {
      setOpen({value: true, msg: "Enter all input fields and upload cover", statusType: exceptionStatus.error})
      return
    }

    let URL = `${BASE_URL}/books`;

    fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(book),
    })
      .then((r) => r.json())
      .then((resp) => {
        isErrorResponse(resp);
        setCreatedBookId(resp.id);
        uploadBookCover(resp.id);
      })
      .catch(err => setOpen({ value: true, msg: err.message, statusType: exceptionStatus.error}))
  };

  const uploadBookCover = (id) => {
    if (!files.length) {
      return
    }

    const formData = new FormData();
    formData.append('files', files[0])

    fetch(`${BASE_URL}/books/${id}/upload`, {
      method: 'PUT',
      headers: {
        "Authorization": localStorage.getItem('token')
      },
      body: formData
    })
    .then( r => r.json())
    .then( resp => {
      isErrorResponse(resp);
      setOpen({ value: true, msg: exceptionMsg.success, statusType: exceptionStatus.success});
      history.goBack();
    })
    .catch( err => setOpen({ value: true, msg: err.message, statusType: exceptionStatus.error}))
    .finally(() => setCreatedBookId(''))

  }
  console.log('create book')
  return (
    <TableRow>
      <TableCell>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="create-book-header"
          label="Header"
          name="header"
          autoComplete="header"
          autoFocus
          value={book.header}
          error={false}
          onChange={(e) => setBook({ ...book, header: e.target.value })}
        />
      </TableCell>
      <TableCell>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="create-book-author"
          label="Author"
          name="author"
          autoComplete="author"
          // autoFocus
          value={book.author}
          error={false}
          onChange={(e) => setBook({ ...book, author: e.target.value })}
        />
      </TableCell>
      <TableCell>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="create-book-contents"
          label="Contents"
          name="contents"
          autoComplete="contents"
          // autoFocus
          value={book.contents}
          error={false}
          onChange={(e) => setBook({ ...book, contents: e.target.value })}
        />
      </TableCell>
      <TableCell>
        {/* <FormFileInput onChange={(e) => setFiles(Array.from(e.target.files))}/> */}
      </TableCell>
      <TableCell>
        <Button size="small" variant="contained" color="primary"
           onClick={ (e) => (e.preventDefault(), createHandler('books', book))}
        >
          Create
        </Button>
      </TableCell>
        <TableCell>
          <Button size="small" variant="outlined" color="primary" onClick={() => history.goBack()}>Cancel</Button>
        </TableCell>
    </TableRow>
  );
};

AdminCreateBookContainer.propTypes = {
  createHandler: propTypes.func.isRequired,
  history: propTypes.object.isRequired,
};

export default withRouter(AdminCreateBookContainer);
