import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import Book from "./Book";
import {
  BASE_URL,
  isErrorResponse,
  exceptionStatus,
} from "../../Constants/Constant";
import { Container, Box } from "@material-ui/core";
import propTypes from "prop-types";
import ExceptionContext from "../../Providers/Context/ExceptionContext";
import Loading from "../Page/Loading/Loading";
import LoadingContext from "../../Providers/Context/LoadingContext";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

const AllBooks = ({
  location,
  match,
  history,
  searchResult,
  resultFromSearch,
}) => {
  const { setOpen } = useContext(ExceptionContext);

  const { loading, setLoading } = useContext(LoadingContext);

  const [books, setBooks] = useState([]);
  useEffect(() => {
    setLoading(true);
    const URL = location.pathname.includes("search")
      ? `${BASE_URL}/books?header=${match.params.header}`
      : `${BASE_URL}/books`;

    fetch(URL)
      .then((r) => r.json())
      .then((resp) => {
        isErrorResponse(resp);
        setBooks(resp);
      })
      .catch((err) =>
        setOpen({
          value: true,
          msg: err.message,
          statusType: exceptionStatus.error,
        })
      )
      .finally(() => setLoading(false));
  }, [location.pathname, match.params.header]);

  const toSingleBookRedirect = (e, bookId) => {
    e.preventDefault();
    history.push(`/books/${bookId}`);
  };
  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      overflow: "hidden",
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      width: "80%",
      height: "450",
    },
    icon: {
      color: "rgba(255, 255, 255, 0.54)",
    },
  }));

  const classes = useStyles();

  const toggleFromSearch =
    searchResult === undefined
      ? books.map((book) => (
          <Book
            key={`book-${book.id}`}
            book={book}
            toSingleBookRedirect={toSingleBookRedirect}
          />
        ))
      : resultFromSearch.map((book) => (
          <Book
            key={`book-${book.id}`}
            book={book}
            toSingleBookRedirect={toSingleBookRedirect}
          />
        ));

  return (
    <>
      {loading ? <Loading /> : null}
      <Container>
        <div className={classes.root}>
          <GridList className={classes.gridList} style={{ marginTop: "50px" }}>
            {" "}
            {/* style = cellHeight={250} spacing={20} cols={4} */}
            {toggleFromSearch}
          </GridList>
        </div>
        <Box mt={33}></Box>
      </Container>
    </>
  );
};

AllBooks.prototype = {
  setMsg: propTypes.func.isRequired,
  setOpen: propTypes.func.isRequired,
};

export default AllBooks;
