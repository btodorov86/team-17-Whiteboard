import { makeStyles, TextField } from "@material-ui/core";
import React, { useContext, useEffect } from "react";
import FormatAlignLeftIcon from "@material-ui/icons/FormatAlignLeft";
import FormatAlignCenterIcon from "@material-ui/icons/FormatAlignCenter";
import FormatAlignRightIcon from "@material-ui/icons/FormatAlignRight";
import FormatBoldIcon from "@material-ui/icons/FormatBold";
import FormatItalicIcon from "@material-ui/icons/FormatItalic";
import FormatUnderlinedIcon from "@material-ui/icons/FormatUnderlined";
import CloseIcon from "@material-ui/icons/Close";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import AuthContext from '../../../Providers/Context/AuthContext';
import ChangeFontSize from '../../Base/ChangeFontSize/ChangeFontSize';

const TextBoxKonva = ({ shapeTextBoxes, setShapes, fontSize, setFontSize, color }) => {

  const { user } = useContext(AuthContext)
  const useStyles = makeStyles((theme) => ({
    // root: {
    //   backgroundColor: theme.palette.background.paper,
    //   width: "auto",

    //   //   minHeight: 200,
    // },
    root: {
      position: "absolute",
      top: shapeTextBoxes.y - 110,
      left: shapeTextBoxes.x,
    //   width: "fit-content",
      width: 220,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.secondary,
      "& svg": {
        margin: theme.spacing(0.9),
      },
      "& hr": {
        margin: theme.spacing(0, 0.5),
      },
    },
    text: {
      border: `1px solid ${theme.palette.divider}`,
    },
    select: {
        border: '1px solid blue'
    }
  }));

  // useEffect(() => {
  //   shapeTextBoxes.updateSize('fill', color)
  // }, [color])

  const classes = useStyles();

  return (
    // <div className={classes.root}>
    <div hidden={!shapeTextBoxes.startDrawing}>
      <Grid container alignItems="center" className={classes.root}>
        <ChangeFontSize fontSize={fontSize} setFontSize={setFontSize} textBox={shapeTextBoxes} />
      
        <Divider orientation="vertical" flexItem />
        <FormatBoldIcon
          onClick={(e) =>
            shapeTextBoxes.fontStyle === "normal"
              ? shapeTextBoxes.updateSize("fontStyle", "bold")
              : shapeTextBoxes.updateSize("fontStyle", "normal")
          }
          className={shapeTextBoxes.fontStyle === "bold" ? classes.select : null}
          style={{ cursor: "pointer" }}
        />
        <FormatItalicIcon
          onClick={(e) =>
            shapeTextBoxes.fontStyle === "normal"
              ? shapeTextBoxes.updateSize("fontStyle", "italic")
              : shapeTextBoxes.updateSize("fontStyle", "normal")
          }
          className={shapeTextBoxes.fontStyle === "italic" ? classes.select : null}
          style={{ cursor: "pointer" }}
        />
        <FormatUnderlinedIcon onClick={(e) =>
            shapeTextBoxes.textDecoration.length === 0
              ? shapeTextBoxes.updateSize("textDecoration", "underline")
              : shapeTextBoxes.updateSize("textDecoration", "")
          }
          className={shapeTextBoxes.textDecoration.length !== 0 ? classes.select : null}
          style={{ cursor: "pointer" }} />
          <Divider orientation="vertical" flexItem />
          <CloseIcon
        onClick={(e) =>
          shapeTextBoxes.updateSize("startDrawing", false)
          }
          style={{ cursor: "pointer" }}
        />
        <TextField
          // multiline
          fullWidth
          variant="filled"
          className={classes.text}
          value={shapeTextBoxes.text}
          autoFocus
          onChange={(e) => { shapeTextBoxes.updateSize('fill', color); shapeTextBoxes.updateSize("text", e.target.value) }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              if (user) {
                shapeTextBoxes.endDrawing(shapeTextBoxes);
              } else {
                setShapes(prev => [...prev, shapeTextBoxes]);
                shapeTextBoxes.clearDrawingObj();
              }

            }
          }}
        />
      </Grid>
    </div>
  );
};

export default TextBoxKonva;
