import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import propTypes from 'prop-types';
import InfoIcon from '@material-ui/icons/Info';
import { withRouter } from 'react-router-dom';
import { BASE_URL } from '../../../Constants/Constant';

const SliderBorrowingBooks = ({ loggedUser, history }) => {

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      overflow: "hidden",
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      flexWrap: "nowrap",
      width: "90%",
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: "translateZ(0)",
    },
    title: {
      color: theme.palette.primary.contrastText,
    },
    titleBar: {
      background:
        "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
    },
  }));
  const classes = useStyles();



  const singleSlide = (data) => (
    <GridListTile key={data.id} style={{paddingTop: '10px'}}>
      <img src={`${BASE_URL}/${data.bookCover}`} alt={data.header} />
      <GridListTileBar
        title={data.header}
        classes={{
          root: classes.titleBar,
          title: classes.title,
        }}
        actionIcon={
          <IconButton aria-label={`star ${''}`} onClick={(e) => (e.preventDefault(), history.push(`books/${data.id}`))}>
            <InfoIcon className={classes.title} />
          </IconButton>
        }
      />
    </GridListTile>
  );

  return (
    <div className={classes.root}>
      <h6>Borrowing Books</h6>
      <GridList className={classes.gridList} cols={3}>
        {loggedUser.borrowedBooks.map((book) => singleSlide(book))}
      </GridList>
    </div>
  );
};

SliderBorrowingBooks.propTypes = {
    loggedUser: propTypes.object.isRequired
}

export default withRouter(SliderBorrowingBooks);
