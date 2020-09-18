import React, { useContext } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import propTypes from "prop-types";
import AuthContext from "../../../Providers/Context/AuthContext";
import { Divider } from '@material-ui/core';

const ProfileMenu = ({
  anchorEl,
  handleClose,
  setIsCreateWhiteboard,
  setIsChangePassword,
  setIsDeleteBoard,
  setIsUpdateBoard,
  setIsChangeAvatar,
}) => {
  const { user } = useContext(AuthContext);

  const toggleChangePassword = user ? (
    <MenuItem
      onClick={(e) => {
        setIsChangePassword(true);
        handleClose();
      }}
      style={{ margin: "10px" }}
    >
      Change password
    </MenuItem>
  ) : null;

  const toggleUpdateAvatar = user ? (
    <MenuItem
      onClick={(e) => {
        setIsChangeAvatar(true);
        handleClose();
      }}
      style={{ margin: "10px" }}
    >
      Update avatar
    </MenuItem>
  ) : null;

  const toggleUpdateWhiteboard = user ? (
    <MenuItem
      onClick={(e) => {
        setIsUpdateBoard(true);
        handleClose();
      }}
      style={{ margin: "10px" }}
    >
      Update board
    </MenuItem>
  ) : null;
  const toggleDeleteWhiteboard = user ? (
    <MenuItem
      onClick={(e) => {
        setIsDeleteBoard(true);
        handleClose();
      }}
      style={{ margin: "10px" }}
    >
      Delete board
    </MenuItem>
  ) : null;

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
      {toggleDeleteWhiteboard}
      {toggleUpdateWhiteboard}
      <Divider orientation="horizontal" variant='middle' />
      {toggleChangePassword}
      {toggleUpdateAvatar}
      <Divider orientation="horizontal" variant='middle' />
    </Menu>
  );
};

ProfileMenu.propTypes = {
  anchorEl: propTypes.oneOfType([propTypes.object, propTypes.bool]).isRequired,
  handleClose: propTypes.func.isRequired,
  setIsChangePassword: propTypes.func.isRequired,
  setIsCreateWhiteboard: propTypes.func.isRequired,
};

export default ProfileMenu;
