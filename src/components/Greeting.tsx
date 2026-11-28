import { useEffect, useRef } from 'react';
import { sampleText } from '../canvas/sampleText';
import { PixelTextRenderer } from '../canvas/PixelTextRenderer';
import './Greeting.css';

const WIDTH = 700;
const HEIGHT = 100;

function Greeting(){
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<PixelTextRenderer | null>(null);


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
//     const renderer = new PixelTextRenderer(canvas, pixels);
const renderer = new PixelTextRenderer(canvas, pixels, {
  hoverRadius: 30,
  hoverReturnSpeed: 6,
});
    renderer.start();
    rendererRef.current = renderer;
  return () => {
        renderer.stop();
        rendererRef.current = null;
      };
    }, []);


      
        const handleMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
          const canvas = canvasRef.current;
          const renderer = rendererRef.current;
          if (!canvas || !renderer) return;
      
          // ⚠️ Convert viewport coords → canvas-local pixels
          const rect = canvas.getBoundingClientRect();
          const scaleX = canvas.width / rect.width;
          const scaleY = canvas.height / rect.height;
      
          renderer.setMouse(
            (e.clientX - rect.left) * scaleX,
            (e.clientY - rect.top) * scaleY
          );
        };
      
        const handleLeave = () => rendererRef.current?.setMouse(null, null);

  return (  
    <>

    <h2>Good Morning</h2>
    <canvas
      ref={canvasRef}
      width={WIDTH}
      height={HEIGHT} 
      // style={{ border: '1px solid #ccc', display: 'block' }}
      style={{ display: 'block' }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className='greeting-canvas'
    >

    </canvas>
    </>
  );
};

export default Greeting;