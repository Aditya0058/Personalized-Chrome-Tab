import { useEffect, useRef } from 'react';
import { sampleText } from '../canvas/sampleText';
import { PixelTextRenderer } from '../canvas/PixelTextRenderer';
import './Greeting.css';

const WIDTH = 250;
const HEIGHT = 100;

function Greeting(){
  const canvasRef = useRef<HTMLCanvasElement>(null);


  useEffect(()=> {
    const canvas = canvasRef.current;
    if (!canvas) return;


    const pixels = sampleText('Hi there', {
      width: WIDTH,
      height: HEIGHT,
      fontSize: 40,
      fontWeight: 'bold',
      threshold: 128,
      step: 2,

    });
    const renderer = new PixelTextRenderer(canvas, pixels);
    renderer.start();

    return () => renderer.stop();

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