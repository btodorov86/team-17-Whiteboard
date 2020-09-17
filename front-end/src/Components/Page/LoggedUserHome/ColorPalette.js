import React from 'react';
import { SketchPicker } from 'react-color';
import propTypes from 'prop-types';

const ColorPalette = ({color, setColor}) => {

    return (
        <div
      style={{
        position: "absolute",
        marginTop: "40px",
        display: "inline-block",
      }}
    >
      <SketchPicker
        color={color}
        onChange={(color) => {
          setColor(color.hex);
        }}
      />
    </div>
    )

};

ColorPalette.propTypes = {
    color: propTypes.string.isRequired,
    setColor: propTypes.func.isRequired,
}

export default ColorPalette
