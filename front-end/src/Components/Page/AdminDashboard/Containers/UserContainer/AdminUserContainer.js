import React, { useContext } from 'react';
import propTypes from 'prop-types';
import { TableRow, TableCell } from '@material-ui/core';
import { dateFormat } from '../../../../../Constants/Constant';
import AdminDeleteBtn from '../../Buttons/AdminDeleteBtn';
import AdminEditBtn from '../../Buttons/AdminEditBtn';
import AdminBanUserBtn from '../../Buttons/AdminBanUserBtn';
import { withRouter } from 'react-router-dom';
import AuthContext from '../../../../../Providers/Context/AuthContext';


const AdminUserContainer = ({dataObj, onClickHandler, onChangeHandler, editHandler}) => {

  const properties = [
    dataObj.id,
    dataObj.firstName,
    dataObj.lastName,
    dataObj.userName,
    dataObj.role,
    <AdminBanUserBtn isBanned={!!dataObj.isBanned} onChangeHandler={onChangeHandler} dataObj={dataObj} />,
    dataObj.isBanned?.expirationDate
      ? dateFormat(new Date(dataObj.isBanned.expirationDate))
      : "DD-MM-YYYY",
    <AdminEditBtn onClickHandler={editHandler} id={dataObj.id} />,
    <AdminDeleteBtn onClickHandler={onClickHandler('users')} id={dataObj.id}/>

  ];

  let num = 200;

  return (
    <TableRow key={`admin-user-container-row-${num++}`}>
       {properties.map( data => <TableCell key={`admin-user-container-cell-${num++}`}>{data}</TableCell> )}
    </TableRow>
  );
};

AdminUserContainer.propTypes = {
    dataObj: propTypes.object.isRequired,
    onClickHandler: propTypes.func.isRequired,
    onChangeHandler: propTypes.func.isRequired,
}

export default withRouter(AdminUserContainer)
