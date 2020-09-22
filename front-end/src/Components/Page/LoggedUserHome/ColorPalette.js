import React from 'react';
import { SketchPicker } from 'react-color';
import propTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const ColorPalette = ({color, setColor, match}) => {

    return match.params.id !== 'my' ? (
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
    ) : null

};

ColorPalette.propTypes = {
    color: propTypes.string.isRequired,
    setColor: propTypes.func.isRequired,
}

export default withRouter(ColorPalette)
