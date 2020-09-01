import React, { useState } from "react";
import { Stage, Layer, Line } from 'react-konva';

const Test = () => {

    const [line, setline] = useState({
        points: [],
        drawing: false
      })
      const [shapes, setShapes] = useState([])

      const mouseDown = (e) => {
        setline({...line, drawing: true})
      }
      const mouseMove = (e) => {
        if (line.drawing) {
          setline({...line, points: [...line.points, e.evt.clientX, e.evt.clientY]})
        }
      }
      const mouseUp = (e) => {
          setShapes([...shapes, line])
          setline({ points: [], drawing: false})
      }

      console.log(shapes);
      console.log(line);
      console.log(line.points.toString().length);

  return (
    <Stage
      onMouseDown={mouseDown}
      onMouseMove={mouseMove}
      onMouseUp={mouseUp}
      height={window.innerHeight}
      width={window.innerWidth}
    >
      <Layer>
        <Line points={line.points} stroke="black" strokeWidth={"5"} />
        {shapes.map( shape => <Line stroke={'red'} strokeWidth={5} points={shape.points} />)}
      </Layer>
    </Stage>
  );
};

export default Test
