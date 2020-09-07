import React, { useState } from "react";
import { Stage, Layer, Line } from 'react-konva';
import { SketchPicker } from 'react-color'

const Test = () => {

    const [line, setline] = useState({
        points: [],
        drawing: false,
        stroke: 'black'
      })
      const [shapes, setShapes] = useState([])
      const [color, setColor] = useState('black')

      const mouseDown = (e) => {
        setline({...line, drawing: true, stroke: color})
      }
      const mouseMove = (e) => {
        if (line.drawing) {
          setline({...line, points: [...line.points, e.evt.clientX - 200, e.evt.clientY]})
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
    <>
    <SketchPicker
    color={color}
    onChange={(color)=>{setColor(color.hex)}}
    
    />

    <Stage
      onMouseDown={mouseDown}
      onMouseMove={mouseMove}
      onMouseUp={mouseUp}
      height={window.innerHeight}
      width={window.innerWidth - 200}
    >
    
      <Layer>
        
        {shapes.map( shape => <Line stroke={shape.stroke} strokeWidth={5} points={shape.points} />)}
        <Line points={line.points} stroke={color} strokeWidth={5} />

      </Layer>
    </Stage>
    </>
  );
};

export default Test
