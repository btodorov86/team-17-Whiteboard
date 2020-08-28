import React from "react";
import propTypes from "prop-types";
import Button from '@material-ui/core/Button'
const AdminEditBtn = ({ onClickHandler, id }) => {
  return (
    <Button size="small" variant="contained" color="primary" onClick={(e) => (e.preventDefault(), onClickHandler(id))}>
      Edit
    </Button>
  );
};

AdminEditBtn.prototype = {
    onClickHandler: propTypes.func.isRequired,
    id: propTypes.string.isRequired,
}

export default AdminEditBtn;
