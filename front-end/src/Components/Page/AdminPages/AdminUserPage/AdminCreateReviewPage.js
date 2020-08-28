import React from "react";
import AdminDashboard from '../../AdminDashboard/AdminDashboard';
import AdminSideBar from '../../../Base/SideBars/AdminSideBar';
import Orders from '../../AdminDashboard/Orders';
import AdminCreateUserContainer from '../../AdminDashboard/Containers/UserContainer/AdminCreateUserContainer';

const AdminCreateUserPage = () => {

  return (
    <AdminDashboard sideBar={AdminSideBar}>
      <Orders
        title={[
           "First Name",
           "Last Name",
           "Username",
           "Email",
           "Password",
           " ",
           "  ",
           // "Create",
           // "Canc
           // "img",
         ]}
        data={[]}
        row={AdminCreateUserContainer}
        // createHandler={createHandler}
      />
    </AdminDashboard>
  );
};

export default AdminCreateUserPage;
