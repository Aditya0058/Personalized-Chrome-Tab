import { useEffect, useRef } from 'react';
import { sampleText } from '../canvas/sampleText';
import { PixelTextRenderer } from '../canvas/PixelTextRenderer';
import './Greeting.css';

const WIDTH = 750;
const HEIGHT = 300;

function Greeting(){
  const canvasRef = useRef<HTMLCanvasElement>(null);


  useEffect(()=> {
    const canvas = canvasRef.current;
    if (!canvas) return;


    const pixels = sampleText('Hi there', {
      width: WIDTH,
      height: HEIGHT,
      fontSize: 100,
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
      width={WIDTH}
      height={HEIGHT} 
      style={{ border: '1px solid #ccc', display: 'block' }}
      className='greeting-canvas'
    >

    </canvas>
  );
};

export default Greeting;