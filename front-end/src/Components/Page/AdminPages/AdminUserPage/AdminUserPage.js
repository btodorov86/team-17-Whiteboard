import React, { useState, useEffect, useContext } from "react";
import AdminDashboard from '../../LoggedUserHome/LoggedUserHome';
import AdminSideBar from '../../../Base/SideBars/AdminSideBar';
import Orders from '../../AdminDashboard/Orders';
import ExceptionContext from '../../../../Providers/Context/ExceptionContext';
import { BASE_URL, exceptionMsg, exceptionStatus, isErrorResponse } from '../../../../Constants/Constant';
import AdminUserContainer from '../../AdminDashboard/Containers/UserContainer/AdminUserContainer';
import Loading from '../../Loading/Loading';
import LoadingContext from '../../../../Providers/Context/LoadingContext';


const AdminUserPage = ({history}) => {

  const { setOpen } = useContext(ExceptionContext);

  const { loading, setLoading } = useContext(LoadingContext);

  const [data, setData] = useState([]);
  const [reRender, setReRender] = useState(false);

  const banHandler = (e, user) => {
    fetch(`${BASE_URL}/ban/users/${user.id}`, {
      method: user.isBanned ? "PUT" : "POST",
      headers: {
        'Authorization' : localStorage.getItem('token')
      },
    })
      .then((r) => r.json())
      .then((resp) => {
        setReRender(!reRender);
        setOpen({value: true, msg: exceptionMsg.success, statusType: exceptionStatus.success})
      })
      .catch((err) => setOpen({value: true, msg: err.message, statusType: exceptionStatus.error}))
      .finally((e.target.checked = !e.target.checked));
  };

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
        .catch((err) => setOpen({value: true, msg: err.message, statusType: exceptionStatus.error}));
    };
  };

  const editHandler = (id) => {
    history.push(`/admin/dashboard/users/${id}/update`)
  };

  useEffect(() => {
    setLoading(true);
    let URL = `${BASE_URL}/users`;
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
  }, [reRender]);

  return (
    <>
    { loading ? <Loading /> : null}
    <AdminDashboard sideBar={AdminSideBar}>
      { data.length ? <Orders
        title={["ID", "First Name", "Last Name", "Username", "Role", "isBanned", "Ban expiration Date", " ", "  "]}
        data={data}
        row={AdminUserContainer}
        onClickHandler={deleteHandler}
        editHandler={editHandler}
        onChangeHandler={banHandler}
      /> : ''}
    </AdminDashboard>
    </>
  );
};

export default AdminUserPage;
