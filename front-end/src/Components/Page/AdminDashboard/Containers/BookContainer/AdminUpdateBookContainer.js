import React, { useState, useContext } from "react";
import { TableRow, TableCell, TextField } from "@material-ui/core";
import propTypes from "prop-types";
import AdminDeleteBtn from "../../Buttons/AdminDeleteBtn";
import { withRouter } from "react-router-dom";
import AdminUpdateBtn from "../../Buttons/AdminUpdateBtn";
import { BASE_URL, isErrorResponse, exceptionMsg, exceptionStatus } from "../../../../../Constants/Constant";
import ExceptionContext from '../../../../../Providers/Context/ExceptionContext';
//DELETE??
const AdminBookUpdateContainer = ({ dataObj, onClickHandler, history }) => {

  const { setOpen } = useContext(ExceptionContext);

  const [sendData, setSendData] = useState({
    header: "",
    author: "",
    contents: "",
  });

  let num = 300;

  const update = () => {
    let URL = `${BASE_URL}/books/${dataObj.id}`;

    const updateObj = {
      header: sendData.header === "" ? dataObj.header : sendData.header,
      author: sendData.author === "" ? dataObj.author : sendData.author,
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

  return (
    <TableRow key={`admin-updateBook-container-row-${num++}`}>
      <TableCell key={`admin-updateBook-container-cell-${num++}`}>
        {dataObj.id}
      </TableCell>
      <TableCell key={`admin-updateBook-container-cell-${num++}`}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="update-updateBook-header"
          label={`${dataObj.header}`}
          name="header"
          autoComplete="header"
          autoFocus
          value={sendData.header}
          error={false}
          onChange={(e) => setSendData({ ...sendData, header: e.target.value })}
        />
      </TableCell>
      <TableCell>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="update-updateBook-author"
          label={`${dataObj.author}`}
          name="author"
          autoComplete="author"
          autoFocus
          value={sendData.author}
          error={false}
          onChange={(e) => setSendData({ ...sendData, author: e.target.value })}
        />
      </TableCell>
      <TableCell>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="update-updateBook-contents"
          label={`${dataObj.contents}`}
          name="contents"
          autoComplete="contents"
          autoFocus
          value={sendData.contents}
          error={false}
          onChange={(e) =>
            setSendData({ ...sendData, contents: e.target.value })
          }
        />
      </TableCell>
      <TableCell>
        <AdminUpdateBtn onClickHandler={update} />
      </TableCell>
      <TableCell>
        <AdminDeleteBtn
          onClickHandler={onClickHandler("books")}
          id={dataObj.id}
        />
      </TableCell>
    </TableRow>
  );
};

AdminBookUpdateContainer.propTypes = {
  dataObj: propTypes.object.isRequired,
  onClickHandler: propTypes.func.isRequired,
};

export default withRouter(AdminBookUpdateContainer);
