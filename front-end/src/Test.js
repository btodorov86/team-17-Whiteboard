import React, { useState } from "react";
import { Stage, Layer, Line } from 'react-konva';
import propTypes from 'prop-types';
import { v4 as uuid } from 'uuid';

const Test = ({color}) => {

    const [line, setline] = useState({
        points: [],
        drawing: false,
        stroke: 'black'
      })
      const [shapes, setShapes] = useState([])

      const mouseDown = (e) => {
        setline({...line, drawing: true, stroke: color})
      }
      const mouseMove = (e) => {
        if (line.drawing) {
          setline({...line, points: [...line.points, e.evt.clientX, e.evt.clientY]});
        }
      }
      const mouseUp = (e) => {
          setShapes([...shapes, line])
          setline({ points: [], drawing: false})
      }

      // console.log(shapes);
      // console.log(line);
      // console.log(line.points.toString().length);

  return (
    // <>
    // <SketchPicker
    // color={color}
    // onChange={(color)=>{setColor(color.hex)}}

    // />

    <Stage
      onMouseDown={mouseDown}
      onMouseMove={mouseMove}
      onMouseUp={mouseUp}
      height={window.innerHeight}
      width={window.innerWidth}
      // draggable={mouseUp ? false : true}
      >
      <Layer>
        {shapes.map( shape => <Line key={uuid()} stroke={shape.stroke} strokeWidth={5} points={shape.points} />)}
        <Line points={line.points} stroke={color} strokeWidth={5} />
      </Layer>
    </Stage>
    // </>
  );
};

Test.propTypes = {
  color: propTypes.string.isRequired,
  // setShareMouse: propTypes.func.isRequired,
  // shareMouse: propTypes.object.isRequired,
}

export default Test
