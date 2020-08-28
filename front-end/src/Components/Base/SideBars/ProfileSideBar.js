import React from "react";
import SideButton from '../../Page/AdminDashboard/SideButton';
import ListSubheader from "@material-ui/core/ListSubheader";
import DashboardIcon from "@material-ui/icons/Dashboard";
import LayersIcon from "@material-ui/icons/Layers";
import CreateNewFolder from "@material-ui/icons/CreateNewFolder";

const ProfileSideBar = () => {
  return (
    <div>
      <ListSubheader inset>Resources</ListSubheader>
      <SideButton name={"Books"} component={LayersIcon} onClickParam={"/"} />
      <SideButton
        name={"Upload Avatar"}
        component={DashboardIcon}
        onClickParam={"/account/avatar/upload"}
      />
      <SideButton
        name={"Update Profile"}
        component={CreateNewFolder}
        onClickParam={"/account/password"}
      />
    </div>
  );
};

export default ProfileSideBar
