import React, { useState, useContext } from "react";
import { TableRow, TableCell, TextField } from "@material-ui/core";
import propTypes from "prop-types";
import AdminDeleteBtn from "../../Buttons/AdminDeleteBtn";
import { withRouter } from "react-router-dom";
import AdminUpdateBtn from "../../Buttons/AdminUpdateBtn";
import { BASE_URL, isErrorResponse, logOutHandler, exceptionMsg, exceptionStatus } from "../../../../../Constants/Constant";
import AuthContext from '../../../../../Providers/Context/AuthContext';
import ExceptionContext from '../../../../../Providers/Context/ExceptionContext';
//DELETE??
const AdminUpdateUserContainer = ({ dataObj, onClickHandler, history }) => {

  const { setOpen } = useContext(ExceptionContext);

  const { user, setUser } = useContext(AuthContext);

    const [sendData, setSendData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    role: dataObj.role,
  });

  const changeUserRole = () => sendData.role === "User" ? "Admin" : "User";


  let num = 1300;

  const update = () => {
    let URL = `${BASE_URL}/users/${dataObj.id}`;

    let updateObj = {};

    sendData.password.length === 0
        ? updateObj = {
        firstName: sendData.firstName === "" ? dataObj.firstName : sendData.firstName,
        lastName: sendData.lastName === "" ? dataObj.lastName : sendData.lastName,
        role: sendData.role === "" ? dataObj.role : sendData.role,}
        : updateObj = {
            firstName: sendData.firstName === "" ? dataObj.firstName : sendData.firstName,
            lastName: sendData.lastName === "" ? dataObj.lastName : sendData.lastName,
            role: sendData.role === "" ? dataObj.role : sendData.role,
            password: sendData.password === "" ? dataObj.password : sendData.password,}

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
      .catch((err) => setOpen({ value: true, msg: err.message, statusType: exceptionStatus.error}))
      .finally(() => {
        if (dataObj.role !== sendData.role && user.id === dataObj.id) {
          logOutHandler(setUser, history)
      }
      })
  };

  return (
    <TableRow key={`admin-update-user-container-row-${num++}`}>
      <TableCell key={`admin-update-user-container-cell-${num++}`}>
        {dataObj.id}
      </TableCell>
      <TableCell key={`admin-update-user-container-cell-${num++}`}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="update-user-first-name"
          label={`${dataObj.firstName}`}
          name="first name"
          autoComplete="first name"
          autoFocus
          value={sendData.firstName}
          error={false}
          onChange={(e) => setSendData({ ...sendData, firstName: e.target.value })}
        />
      </TableCell>
      <TableCell>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="update-user-last-name"
          label={`${dataObj.lastName}`}
          name="last name"
          autoComplete="last name"
          autoFocus
          value={sendData.lastName}
          error={false}
          onChange={(e) => setSendData({ ...sendData, lastName: e.target.value })}
        />
      </TableCell>
      <TableCell>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="update-user-password"
          label="Password"
          name="password"
          autoComplete="password"
          autoFocus
          value={sendData.password}
          error={false}
          onChange={(e) =>
            setSendData({ ...sendData, password: e.target.value })
          }
        />
      </TableCell>
      <TableCell>
        <input type='checkbox' checked={sendData.role === 'Admin' ? true : false} onChange={(e) => setSendData({...sendData, role: changeUserRole()})}  />
      </TableCell>
      <TableCell>
        <AdminUpdateBtn onClickHandler={update} />
      </TableCell>
      <TableCell>
        <AdminDeleteBtn
          onClickHandler={onClickHandler("users")}
          id={dataObj.id}
        />
      </TableCell>
    </TableRow>
  );
};

AdminUpdateUserContainer.propTypes = {
  dataObj: propTypes.object.isRequired,
  onClickHandler: propTypes.func.isRequired,
};

export default withRouter(AdminUpdateUserContainer);
