import React, { useEffect, useRef } from 'react';
import './Greeting.css'


interface GreetingProps {
  /** Text to render */
  text?: string;
  /** Size of each pixel block (larger = chunkier) */
  pixelSize?: number;
  /** Font size used in the off‑screen rasterisation */
  fontSize?: number;
  /** Text colour */
  color?: string;
  /** Canvas background colour (use 'transparent' for none) */
  backgroundColor?: string;
  /** Canvas width in CSS pixels */
  width?: number;
  /** Canvas height in CSS pixels */
  height?: number;
}


const Greeting: React.FC<GreetingProps> = ({
  text = 'Aditya Rajput',
  pixelSize = 8,
  fontSize = 220,
  color = '#ffffff',
  backgroundColor = 'transparent',
  width = 1200,
  height = 400,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ----- Handle high‑DPI screens -----
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // ----- Load the Instrument Serif font -----
    const loadFont = async () => {
      try {
        await document.fonts.load(`${fontSize}px "Instrument Serif"`);
        // Optional: wait for all fonts to be ready
        // await document.fonts.ready;
      } catch (e) {
        console.warn('Instrument Serif could not be loaded, falling back to serif', e);
      }
      drawPixelText();
    };

    const drawPixelText = () => {
      // ----- 1. Create an off‑screen canvas for the "real" text -----
      const offscreen = document.createElement('canvas');
      offscreen.width = width;
      offscreen.height = height;
      const offCtx = offscreen.getContext('2d');
      if (!offCtx) return;

      // Background (if any)
      if (backgroundColor !== 'transparent') {
        offCtx.fillStyle = backgroundColor;
        offCtx.fillRect(0, 0, width, height);
      }

      // Draw the text centred
      offCtx.font = `${fontSize}px "Instrument Serif", serif`;
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillStyle = color;
      offCtx.fillText(text, width / 2, height / 2);

      // ----- 2. Read the pixel data -----
      const imageData = offCtx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // ----- 3. Clear the main canvas -----
      ctx.clearRect(0, 0, width, height);
      if (backgroundColor !== 'transparent') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
      }

      // ----- 4. Paint enlarged pixel blocks -----
      for (let y = 0; y < height; y += pixelSize) {
        for (let x = 0; x < width; x += pixelSize) {
          const i = (y * width + x) * 4; // RGBA index
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          // Skip fully transparent pixels (keeps the background clean)
          if (a < 10) continue;

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
          ctx.fillRect(x, y, pixelSize, pixelSize);
        }
      }
    };

    loadFont();
}, [text, pixelSize, fontSize, color, backgroundColor, width, height]);

    return (
         <canvas
      ref={canvasRef}
      style={{ display: 'block', width, height }}
      aria-label={`Pixel art of the text "${text}"`}
    />
    );
}

export default Greeting;