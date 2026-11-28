import type { Pixel, SampleOptions } from './types';

export function sampleText(text: string, opts: SampleOptions): Pixel[] {
  const {
    width,
    height,
    fontSize,
    fontFamily = 'monospace',
    fontWeight = 'bold',
    threshold = 128,
    color = '#ffffff',
    step = 4,
    
  } = opts;

  const off = document.createElement('canvas');
  off.width = width;
  off.height = height;
  const ctx = off.getContext('2d');
  if (!ctx) return [];

  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.fillText(text, width / 2, height / 2);


  const { data } = ctx.getImageData(0, 0, width, height);

   const pixels: Pixel[] = [];
   for (let y = 0; y < height; y+=6) {
    for (let x = 0; x < width; x+=6) {
        //  here i is index (positon of pixels which we'll be using to find the data of that pixel)
      const i = (y * width + x) * 4;
        // alpha is opacity and we have opacity value at i+3 for each pixel (R, G, B, A)
      const alpha = data[i + 3];

      if (alpha > threshold) {
        pixels.push({ 
          x,
          y,
          homeX: x,
          homeY: y,
          color: `rgb(${data[i]},${data[i + 1]},${data[i + 2]})`,
          size: step,
          shape: 'square',
          // shapeSpeed: 0.3 + Math.sin(x * 0.05) * 0.1,  // wave pattern
          shapeSpeed: 0.2 + (x / width) * 0.4,
          shapePhase:  0,
          // shapeSet: ['cross'],
          shapeSet: ['square', 'circle', 'cross', 'diamond',],
        });
      }
    }
  }

return pixels;
};