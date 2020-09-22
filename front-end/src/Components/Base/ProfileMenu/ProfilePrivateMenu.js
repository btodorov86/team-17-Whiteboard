import React, { useContext } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import propTypes from "prop-types";
import AuthContext from "../../../Providers/Context/AuthContext";
import { Divider } from '@material-ui/core';

const ProfilePrivateMenu = ({
  anchorEl,
  handleClose,
  setIsCreateWhiteboard,
  setIsChangePassword,
  setIsDeleteBoard,
  setIsUpdateBoard,
  setIsChangeAvatar,
  setIsInviteUser,
  setIsKickUsers,
  setIsShareMouse,
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
      <MenuItem
      onClick={(e) => {
        setIsDeleteBoard(true);
        handleClose();
      }}
      style={{ margin: "10px" }}
    >
      Delete board
    </MenuItem>
      <MenuItem
      onClick={(e) => {
        setIsUpdateBoard(true);
        handleClose();
      }}
      style={{ margin: "10px" }}
    >
      Update board
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
      {/* {toggleUpdateAvatar} */}
      <Divider orientation="horizontal" variant='middle' />
      <MenuItem
      onClick={(e) => {
        setIsInviteUser(true);
        handleClose();
      }}
      style={{ margin: "10px" }}
    >
      Invite User
    </MenuItem>
      <MenuItem
      onClick={(e) => {
        setIsKickUsers(true);
        handleClose();
      }}
      style={{ margin: "10px" }}
    >
      Kick User
    </MenuItem>
      <MenuItem
      onClick={(e) => {
        setIsShareMouse(prev => !prev);
        handleClose();
      }}
      style={{ margin: "10px" }}
    >
      Share mouse
    </MenuItem>
    </Menu>
  );
};

ProfilePrivateMenu.propTypes = {
  anchorEl: propTypes.oneOfType([propTypes.object, propTypes.bool]).isRequired,
  handleClose: propTypes.func.isRequired,
  setIsChangePassword: propTypes.func.isRequired,
  setIsCreateWhiteboard: propTypes.func.isRequired,
  setIsDeleteBoard: propTypes.func.isRequired,  
  setIsUpdateBoard: propTypes.func.isRequired,
  setIsChangeAvatar: propTypes.func.isRequired,
  setIsInviteUser: propTypes.func.isRequired,
  setIsKickUsers: propTypes.func.isRequired,
  setIsShareMouse: propTypes.func.isRequired,
};

export default ProfilePrivateMenu;
