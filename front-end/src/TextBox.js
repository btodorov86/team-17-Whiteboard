import { makeStyles, TextField } from "@material-ui/core";
import React from "react";
import FormatAlignLeftIcon from "@material-ui/icons/FormatAlignLeft";
import FormatAlignCenterIcon from "@material-ui/icons/FormatAlignCenter";
import FormatAlignRightIcon from "@material-ui/icons/FormatAlignRight";
import FormatBoldIcon from "@material-ui/icons/FormatBold";
import FormatItalicIcon from "@material-ui/icons/FormatItalic";
import FormatUnderlinedIcon from "@material-ui/icons/FormatUnderlined";
import CloseIcon from "@material-ui/icons/Close";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";

const TextBoxKonva = ({ shapeTextBox, setShapes }) => {
  const useStyles = makeStyles((theme) => ({
    // root: {
    //   backgroundColor: theme.palette.background.paper,
    //   width: "auto",

    //   //   minHeight: 200,
    // },
    root: {
      position: "absolute",
      top: shapeTextBox.y - 110,
      left: shapeTextBox.x,
    //   width: "fit-content",
      width: 360,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.secondary,
      "& svg": {
        margin: theme.spacing(1.5),
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

  const classes = useStyles();

  console.log(shapeTextBox.text);

  return (
    // <div className={classes.root}>
    <div hidden={!shapeTextBox.startDrawing}>
      <Grid container alignItems="center" className={classes.root}>
        <FormatAlignLeftIcon />
        <FormatAlignCenterIcon />
        <FormatAlignRightIcon />
        <Divider orientation="vertical" flexItem />
        <FormatBoldIcon
          onClick={(e) =>
            shapeTextBox.fontStyle === "normal"
              ? shapeTextBox.updateSize("fontStyle", "bold")
              : shapeTextBox.updateSize("fontStyle", "normal")
          }
          className={shapeTextBox.fontStyle === "bold" ? classes.select : null}
          style={{ cursor: "pointer" }}
        />
        <FormatItalicIcon
          onClick={(e) =>
            shapeTextBox.fontStyle === "normal"
              ? shapeTextBox.updateSize("fontStyle", "italic")
              : shapeTextBox.updateSize("fontStyle", "normal")
          }
          className={shapeTextBox.fontStyle === "italic" ? classes.select : null}
          style={{ cursor: "pointer" }}
        />
        <FormatUnderlinedIcon onClick={(e) =>
            shapeTextBox.textDecoration.length === 0
              ? shapeTextBox.updateSize("textDecoration", "underline")
              : shapeTextBox.updateSize("textDecoration", "")
          }
          className={shapeTextBox.textDecoration.length !== 0 ? classes.select : null}
          style={{ cursor: "pointer" }} />
          <Divider orientation="vertical" flexItem />
          <CloseIcon
        onClick={(e) =>
            shapeTextBox.updateSize("startDrawing", false)
          }
          style={{ cursor: "pointer" }}
        />
        <TextField
          multiline
          fullWidth
          variant="filled"
          className={classes.text}
          value={shapeTextBox.text}
          autoFocus
          onChange={(e) => shapeTextBox.updateSize("text", e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              setShapes((prev) => [...prev, shapeTextBox]);
              shapeTextBox.endDrawing();
            }
          }}
        />
      </Grid>
    </div>

    //   <h1>GDHGJSGDHJSGFSGFHJ</h1>
    // </div>
  );
};

export default TextBoxKonva;
