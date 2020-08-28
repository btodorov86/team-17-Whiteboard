import React from "react";
import propTypes from "prop-types";
import Button from '@material-ui/core/Button'

const AdminUpdateBtn = ({onClickHandler}) => {
  return (
    <Button size="small" variant="contained" color="primary" onClick={(e) => (e.preventDefault(), onClickHandler())}>
      Update
    </Button>
  );
};

AdminUpdateBtn.prototype = {
    onClickHandler: propTypes.func.isRequired,
    // id: propTypes.string.isRequired,
}

export default AdminUpdateBtn;
