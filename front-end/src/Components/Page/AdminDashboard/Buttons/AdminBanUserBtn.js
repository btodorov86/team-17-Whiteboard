import React from 'react';
import propTypes from 'prop-types';


const AdminBanUserBtn = ({isBanned, onChangeHandler, dataObj}) => {

    return (
        <input
          type="checkbox"
          checked={isBanned}
          onChange={(e) => (e.preventDefault(), onChangeHandler(e, dataObj))}
        ></input>
    )

};

AdminBanUserBtn.prototype = {
    onChangeHandler: propTypes.func.isRequired,
    dataObj: propTypes.object.isRequired,
    isBanned: propTypes.bool.isRequired,
}

export default AdminBanUserBtn
