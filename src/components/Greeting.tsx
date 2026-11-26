import { useEffect, useRef } from 'react';
import './Greeting.css';

function Greeting(){
  const canvasRef = useRef<HTMLCanvasElement>(null);
  

  useEffect(()=> {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d'); 
    if (!ctx) return;
    
  
    ctx.fillStyle = '#4A90E2';
    ctx.fillRect(0, 0, 250, 100);

    ctx.fillStyle = '#ffffff';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Hi there', 125, 50);

  }, []);

  

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