import React from "react";
import propTypes from "prop-types";
import Button from '@material-ui/core/Button'
const AdminDeleteBtn = ({onClickHandler, id}) => {
  return (
    <Button size="small" variant="contained" color="secondary" onClick={(e) => (e.preventDefault(), onClickHandler(id))}>
      Delete
    </Button>
  );
};

AdminDeleteBtn.prototype = {
    onClickHandler: propTypes.func.isRequired,
    id: propTypes.string.isRequired,
}

export default AdminDeleteBtn;
