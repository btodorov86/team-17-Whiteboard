import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import { BASE_URL } from '../../Constants/Constant';

const Book = (props) => {

  const useStyles = makeStyles(() => ({
    icon: {
      color: "rgba(255, 255, 255, 0.54)",
    },
  }));

  const classes = useStyles();

  return (
    <GridListTile key={props.book.content} style={{width: '25%', height: '270px', padding: '10px'}}>
      <img src={`${BASE_URL}/${props.book.bookCover}`} alt={props.book.header} />
      <GridListTileBar
        title={props.book.header}
        subtitle={<span>by: {props.book.author}</span>}
        actionIcon={
          <IconButton
            onClick={(e) => props.toSingleBookRedirect(e, props.book.id)}
            aria-label={`info about ${props.book.header}`}
            className={classes.icon}
          >
            <InfoIcon />
          </IconButton>
        }
      />
    </GridListTile>
  );
};

export default Book;
