// import React, { useEffect, useRef } from 'react';
import { useRef } from 'react';
import './Greeting.css';

function Greeting(){
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <canvas
      ref={canvasRef}
      width={250}
      height={100}
      style={{ border: '1px solid #ccc', display: 'block' }}
      className='greeting-canvas'
    >

    </canvas>
  );
};

export default Greeting;