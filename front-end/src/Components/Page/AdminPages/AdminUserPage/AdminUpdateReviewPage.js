import React, { useState, useEffect, useContext } from "react";
import AdminDashboard from '../../AdminDashboard/AdminDashboard';
import AdminSideBar from '../../../Base/SideBars/AdminSideBar';
import Orders from '../../AdminDashboard/Orders';
import ExceptionContext from '../../../../Providers/Context/ExceptionContext';
import { BASE_URL, exceptionMsg, exceptionStatus, isErrorResponse } from '../../../../Constants/Constant';
import AdminUpdateUserContainer from '../../AdminDashboard/Containers/UserContainer/AdminUpdateUserContainer';
import Loading from '../../Loading/Loading';
import LoadingContext from '../../../../Providers/Context/LoadingContext';


const AdminUpdateUserPage = ({match}) => {
  const [data, setData] = useState([]);

  const { loading, setLoading } = useContext(LoadingContext);

  const { setOpen } = useContext(ExceptionContext);

  const deleteHandler = (endPoint) => {
    return (deletedId) => {
      fetch(`${BASE_URL}/${endPoint}/${deletedId}`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
        .then((r) => r.text())
        .then((resp) => {
          setData(data.filter((obj) => obj.id !== deletedId));
          setOpen({value: true, msg: exceptionMsg.success, statusType: exceptionStatus.success})

        })
        .catch((err) => setOpen({value: true, msg: err.message, statusType: exceptionStatus.error}))
    };
  };

  useEffect(() => {
    setLoading(true);
    let URL = `${BASE_URL}/users/${match.params.id}`;
    fetch(URL, {
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    })
      .then((r) => r.json())
      .then((resp) => {
        isErrorResponse(resp);
        setData(resp);
      })
      .catch((err) => setOpen({value: true, msg: err.message, statusType: exceptionStatus.error}))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
    { loading ? <Loading /> : null}
    <AdminDashboard sideBar={AdminSideBar}>
      { data.length !== 0 ? <Orders
        title={[
           "ID",
           "First Name",
           "Last Name",
           "Password",
           "Admin",
           " ",
           "  ",
           // "Create",
           // "Cancel",
        ]}
        data={data}
        row={AdminUpdateUserContainer}
        // dataObj={data}
        onClickHandler={deleteHandler}
      /> : ''}
    </AdminDashboard>
    </>
  );
};

export default AdminUpdateUserPage;
