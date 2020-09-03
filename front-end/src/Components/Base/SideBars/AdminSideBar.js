import React from "react";
import { ListSubheader } from '@material-ui/core';
import SideButton from '../../Page/AdminDashboard/SideButton';
import DashboardIcon from "@material-ui/icons/Dashboard";
import PeopleIcon from "@material-ui/icons/People";
import LayersIcon from "@material-ui/icons/Layers";

const AdminSideBar = ({setReRender, reRender}) => {
  return (
      <div>
        <ListSubheader inset>Resources</ListSubheader>
        <SideButton
          name={"Users"}
          component={PeopleIcon}
          onClickParam={"/admin/dashboard/users"}
        />
        <SideButton
          name={"Books"}
          setReRender={setReRender}
          reRender={reRender}
          component={LayersIcon}
          onClickParam={"/admin/dashboard/books"}
        />
        <SideButton
          name={"Reviews"}
          component={DashboardIcon}
          onClickParam={"/admin/dashboard/reviews"}
        />
      </div>
  );
};

export default AdminSideBar
