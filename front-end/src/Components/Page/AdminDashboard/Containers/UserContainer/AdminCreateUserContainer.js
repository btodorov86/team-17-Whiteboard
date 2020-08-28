import React, { useState, useContext } from "react";
import { TableRow, TableCell, TextField, Button } from "@material-ui/core";
import propTypes from "prop-types";
import { withRouter } from 'react-router-dom';
import { BASE_URL, isErrorResponse, exceptionMsg, exceptionStatus } from '../../../../../Constants/Constant';
import ExceptionContext from '../../../../../Providers/Context/ExceptionContext';

const AdminCreateUserContainer = ({ history }) => {

  const { setOpen } = useContext(ExceptionContext);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    // avatar:
  });

  const createHandler = (resource, createObj) => {

    if (Object.keys(user).some( x => user[x].length === 0 )) {
      setOpen({value: true, msg: "Missing input field", statusType: exceptionStatus.error})
    }

    let URL = `${BASE_URL}/${resource}`;

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
      <TableCell>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="create-user-container-firstName"
          label="First Name"
          name="first name"
          autoComplete="first name"
          autoFocus
          value={user.firsName}
          error={false}
          onChange={(e) => setUser({ ...user, firstName: e.target.value })}
        />
      </TableCell>
      <TableCell>
      <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="create-user-lastName"
          label="Last Name"
          name="last name"
          autoComplete="last name"
          autoFocus
          value={user.lastName}
          error={false}
          onChange={(e) => setUser({ ...user, lastName: e.target.value })}
        />
      </TableCell>
      <TableCell>
      <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="create-user-username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          value={user.userName}
          error={false}
          onChange={(e) => setUser({ ...user, userName: e.target.value })}
        />
      </TableCell>
      <TableCell>
      <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="create-user-email"
          label="Email"
          name="email"
          autoComplete="email"
          autoFocus
          value={user.email}
          error={false}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
      </TableCell>
      <TableCell>
      <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="create-user-password"
          label="Password"
          name="password"
          autoComplete="password"
          autoFocus
          value={user.password}
          error={false}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
      </TableCell>
      <TableCell>
        <Button size="small" variant="contained" color="primary"
          onClick={ (e) => (e.preventDefault(), createHandler('users', user))}
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

AdminCreateUserContainer.propTypes = {
  history: propTypes.object.isRequired,
};

export default withRouter(AdminCreateUserContainer);
