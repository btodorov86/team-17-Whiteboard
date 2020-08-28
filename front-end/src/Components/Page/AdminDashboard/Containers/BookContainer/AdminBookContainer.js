import React from 'react';
import { TableRow, TableCell } from '@material-ui/core';
import propTypes from 'prop-types';
import AdminDeleteBtn from '../../Buttons/AdminDeleteBtn';
import AdminEditBtn from '../../Buttons/AdminEditBtn';
import { withRouter } from 'react-router-dom';


const AdminBookContainer = ({dataObj, onClickHandler, editHandler}) => {
console.log('AdminBookContainer')
  const properties = [
    dataObj.id,
    dataObj.header,
    typeof dataObj.author === 'object' ? '' : dataObj.author,
    dataObj.contents,
    <AdminEditBtn onClickHandler={editHandler} id={dataObj.id} />,
    <AdminDeleteBtn onClickHandler={onClickHandler('books')} id={dataObj.id}/>
  ];

  let num = 1

    return (
        <TableRow key={`admin-book-container-row-${num++}`}>
          {properties.map( data => <TableCell key={`admin-book-container-cell-${num++}`}>{data}</TableCell> )}
        </TableRow>
    )

};

AdminBookContainer.propTypes = {
    dataObj: propTypes.object.isRequired,
    onClickHandler: propTypes.func.isRequired,
    editHandler: propTypes.func.isRequired
}


export default withRouter(AdminBookContainer)
