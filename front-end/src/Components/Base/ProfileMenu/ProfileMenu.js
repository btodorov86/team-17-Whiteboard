import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import propTypes from "prop-types";
import { Divider } from '@material-ui/core';
import { withRouter } from 'react-router-dom';

const ProfileMenu = ({
  anchorEl,
  handleClose,
  setIsCreateWhiteboard,
  setIsChangePassword,
  setIsChangeAvatar,
  setIsShareMouse,
  location,
}) => {

  return (
    <Menu
      style={{ top: "-4px" }}
      id="simple-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <MenuItem
        onClick={(e) => {
          setIsCreateWhiteboard(true);
          handleClose();
        }}
        style={{ margin: "10px" }}
      >
        Create board
      </MenuItem>
      <Divider orientation="horizontal" variant='middle' />
      {/* {toggleChangePassword} */}
      <MenuItem
      onClick={(e) => {
        setIsChangePassword(true);
        handleClose();
      }}
      style={{ margin: "10px" }}
    >
      Change password
    </MenuItem>
      <MenuItem
      onClick={(e) => {
        setIsChangeAvatar(true);
        handleClose();
      }}
      style={{ margin: "10px" }}
    >
      Update avatar
    </MenuItem>
      <Divider orientation="horizontal" variant='middle' />
      { !location.pathname.includes('my') ? <MenuItem
      onClick={(e) => {
        setIsShareMouse(prev => !prev);
        handleClose();
      }}
      style={{ margin: "10px" }}
    >
      Share mouse
    </MenuItem> : null }
    </Menu>

  );
};

ProfileMenu.propTypes = {
  anchorEl: propTypes.oneOfType([propTypes.object, propTypes.bool]).isRequired,
  handleClose: propTypes.func.isRequired,
  setIsChangePassword: propTypes.func.isRequired,
  setIsCreateWhiteboard: propTypes.func.isRequired,
};

export default withRouter(ProfileMenu);
