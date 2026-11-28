import { useEffect, useRef } from 'react';
import { sampleText } from '../canvas/sampleText';
import { PixelTextRenderer } from '../canvas/PixelTextRenderer';
import './Greeting.css';

const WIDTH = 700;
const HEIGHT = 100;

function Greeting(){
  const canvasRef = useRef<HTMLCanvasElement>(null);


  useEffect(()=> {
    const canvas = canvasRef.current;
    if (!canvas) return;


    const pixels = sampleText('Aditya Rajput', {
      width: WIDTH,
      height: HEIGHT,
      fontSize: 80,
      fontWeight: 'bold',
      threshold: 128,
      step: 5,

    });
    const renderer = new PixelTextRenderer(canvas, pixels);
    renderer.start();

    return () => renderer.stop();

  }, []);

   

  return (  
    <>

    <h2>Good Morning</h2>
    <canvas
      ref={canvasRef}
      width={WIDTH}
      height={HEIGHT} 
      // style={{ border: '1px solid #ccc', display: 'block' }}
      style={{ display: 'block' }}
      className='greeting-canvas'
    >

    </canvas>
    </>
  );
};

export default Greeting;