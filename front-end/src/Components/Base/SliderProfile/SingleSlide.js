import React from 'react';
import { makeStyles, GridList } from '@material-ui/core';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';


const SingleSlide = ({ data, ...props}) => {

    const useStyles = makeStyles((theme) => ({
        root: {
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          overflow: 'hidden',
          backgroundColor: theme.palette.background.paper,
        },
        gridList: {
          flexWrap: 'nowrap',
          width: '90%',
          transform: 'translateZ(0)',
        },
        title: {
          color: theme.palette.primary.light,
        },
        titleBar: {
          background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
        },
      }));
        const classes = useStyles();


    return (
        <GridList className={classes.gridList}>
        <GridListTile key={data.img}>
            <img src={data.bookCover} alt={data.title} />
            <GridListTileBar
              title={data.title}
              classes={{
                root: classes.titleBar,
                title: classes.title,
              }}
              actionIcon={
                <IconButton aria-label={`star ${data.title}`}>
                  <StarBorderIcon className={classes.title} />
                </IconButton>
              }
            />
          </GridListTile>
          </GridList>
    )

};

export default SingleSlide
