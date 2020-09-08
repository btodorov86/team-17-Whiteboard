import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import propTypes from 'prop-types';

const ProfileMenu = ({anchorEl, handleClose}) => {

    return (
        <Menu
              style={{ top: "-4px" }}
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose} style={{ margin: "10px" }}>
                Create board
              </MenuItem>
              <MenuItem onClick={handleClose} style={{ margin: "10px" }}>
                Change password
              </MenuItem>
              <MenuItem onClick={handleClose} style={{ margin: "10px" }}>
                Update avatar
              </MenuItem>
            </Menu>
    )

};

ProfileMenu.propTypes = {
    anchorEl: propTypes.bool.isRequired,
    handleClose: propTypes.oneOfType([
        propTypes.bool,
        propTypes.element,
    ]).isRequired,
}

export default ProfileMenu
