import React from "react";
import { TableRow, TableCell } from "@material-ui/core";
import propTypes from "prop-types";
import { withRouter } from 'react-router-dom';
import AdminDeleteBtn from '../../Buttons/AdminDeleteBtn';
import AdminEditBtn from '../../Buttons/AdminEditBtn';

const AdminReviewContainer = ({ dataObj, onClickHandler, editHandler }) => {

  const properties = [
    dataObj.id,
    typeof dataObj.author === 'object' ? dataObj.author.id : '',
    typeof dataObj.author === 'object' ? dataObj.author.userName : '',
    typeof dataObj.forBook === 'object' ? dataObj.forBook.id : '',
    typeof dataObj.forBook === 'object' ? dataObj.forBook.header : '',
    dataObj.contents,
    typeof dataObj.reaction === 'object' ? dataObj.reaction.like : '',
    typeof dataObj.reaction === 'object' ? dataObj.reaction.dislike : '',
    typeof dataObj.reaction === 'object' ? dataObj.reaction.love : '',
    <AdminEditBtn onClickHandler={editHandler} id={dataObj.id} />,
    <AdminDeleteBtn onClickHandler={onClickHandler('reviews')} id={dataObj.id}/>

  ];

  let num = 100;

  return (
    <TableRow key={`admin-review-container-row-${num++}`}>
       {properties.map( data => <TableCell key={`admin-review-container-cell-${num++}`}>{data}</TableCell> )}
    </TableRow>
  );
};

AdminReviewContainer.propTypes = {
  dataObj: propTypes.object.isRequired,
  onClickHandler: propTypes.func.isRequired,
};

export default withRouter(AdminReviewContainer);
