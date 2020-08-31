import React, { useState, useEffect, useContext } from "react";
import {
  BASE_URL,
  isErrorResponse,
  exceptionStatus,
  exceptionMsg,
} from "../../../../Constants/Constant";
import ExceptionContext from "../../../../Providers/Context/ExceptionContext";
import Orders from "../../AdminDashboard/Orders";
import AdminBookContainer from "../../AdminDashboard/Containers/BookContainer/AdminBookContainer";
import AdminSideBar from "../../../Base/SideBars/AdminSideBar";
import AdminDashboard from "../../LoggedUserHome/LoggedUserHome";
import Loading from '../../Loading/Loading';
import LoadingContext from '../../../../Providers/Context/LoadingContext';

const AdminBookPage = ({ history }) => {

  const { setOpen } = useContext(ExceptionContext);

  const { loading, setLoading } = useContext(LoadingContext);

  const [data, setData] = useState([]);

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
          setOpen({
            value: true,
            msg: exceptionMsg.success,
            statusType: exceptionStatus.success,
          });
        })
        .catch((err) =>
          setOpen({
            value: true,
            msg: err.message,
            statusType: exceptionStatus.error,
          })
        );
    };
  };

  const editHandler = (id) => {
    history.push(`/admin/dashboard/books/${id}/update`);
  };

  useEffect(() => {
    setLoading(true);
    let URL = `${BASE_URL}/books`;
    fetch(URL, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((r) => r.json())
      .then((resp) => {
        isErrorResponse(resp);

        setData(resp);
      })
      .catch((err) =>
        setOpen({
          value: true,
          msg: err.message,
          statusType: exceptionStatus.error,
        })
      )
      .finally(() => setLoading(false))
  }, []);

  return (
    <>
    { loading ? <Loading /> : null}
    <AdminDashboard sideBar={AdminSideBar}>
      {data.length !== 0 ? (
        <Orders
          title={["ID", "Header", "Author", "Content", " ", "  "]}
          data={data}
          row={AdminBookContainer}
          // dataObj={data}
          onClickHandler={deleteHandler}
          editHandler={editHandler}
        />
      ) : (
        ""
      )}
    </AdminDashboard>
    </>
  );
};

export default AdminBookPage;
