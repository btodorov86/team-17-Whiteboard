import React from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { withRouter } from "react-router-dom";
import CreateIcon from "@material-ui/icons/Create";
import Title from './Title';
import SideButton from './SideButton';

const Orders = ({ location, history, title, row: Row1, editHandler, onClickHandler, data, onChangeHandler, loggedUser }) => {
    const useStyles = makeStyles((theme) => ({
    seeMore: {
      marginTop: theme.spacing(3),
    },
  }));

  const toggleCreateBtn = location.pathname.includes('update') || location.pathname.includes('create') || location.pathname.includes('account') ? '' : <SideButton
  name={"Create"}
  component={CreateIcon}
  show={false}
  // onClickFunk={redirect}
  onClickParam={
    location.pathname.includes("create") ? location.pathname : `${location.pathname}/create`
  }
/>

  const classes = useStyles();

  // const switchAdmin = location.pathname.includes('account') ?

  return (
    <React.Fragment>
      <Title>
        {toggleCreateBtn}
      </Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            {title.length !== 0
              ? title.map((title) => (
                  <TableCell key={`header-title-${title}`}>{title}</TableCell>
                ))
              : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length ? data.map((row) => <Row1 key={`key-row-${row.id}`} dataObj={row} editHandler={editHandler} onClickHandler={onClickHandler} onChangeHandler={onChangeHandler}/>) : <Row1 dataObj={data} editHandler={editHandler} onClickHandler={onClickHandler}/>}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link
          color="primary"
          href="#"
          onClick={(e) => e.preventDefault()}
          hidden={location.pathname.includes("create") ? true : false}
        >
          See more orders
        </Link>
      </div>
    </React.Fragment>
  );
};

export default withRouter(Orders);
