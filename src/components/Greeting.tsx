import React, { useEffect, useRef } from 'react';
import './Greeting.css';

interface GreetingProps {
  /** Text to render */
  text?: string;
  /** Size of each pixel block (larger = chunkier) */
  pixelSize?: number;
  /** Font size used in the off-screen rasterisation */
  fontSize?: number;
  /** Text colour (uniform for every lit pixel) */
  color?: string;
  /** Canvas background colour (use 'transparent' for none) */
  backgroundColor?: string;
  /** Canvas width in CSS pixels */
  width?: number;
  /** Canvas height in CSS pixels */
  height?: number;
  /** 0–0.9: how much of each block is left empty as gap */
  gapRatio?: number;
  /** 0–255: alpha above which a block is drawn */
  threshold?: number;
  hoverColor?: string;
  /** Radius (px) around the cursor that lights up */
  hoverRadius?: number;
  /** How long (ms) a hovered pixel stays lit before reverting */
  hoverDuration?: number;
}

const Greeting: React.FC<GreetingProps> = ({
  text = 'Aditya Rajput',
  pixelSize = 10,
  fontSize = 180,
  color = '#ffffff',
  backgroundColor = 'transparent',
  width = 1400,
  height = 400,
  gapRatio = 0.3,
  threshold = 128,
  hoverColor = '#ff3366',
  hoverRadius = 60,
  hoverDuration = 700,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // ---------- high-DPI setup ----------
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  type Pixel = { x: number; y: number; expiresAt: number };
  let pixels: Pixel[] = [];
  let blockSize = 1;
  let offset = 0;
  let rafId = 0;

  // ---------- draw everything with current colours ----------
  const render = () => {
    ctx.clearRect(0, 0, width, height);
    if (backgroundColor !== 'transparent') {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
    }
    const now = performance.now();
    for (const p of pixels) {
      ctx.fillStyle = p.expiresAt > now ? hoverColor : color;
      ctx.fillRect(p.x, p.y, blockSize, blockSize);
    }
  };

  // ---------- rAF loop: only runs while pixels are lit ----------
  const loop = () => {
    const now = performance.now();
    render();
    if (pixels.some((p) => p.expiresAt > now)) {
      rafId = requestAnimationFrame(loop);
    } else {
      rafId = 0;
    }
  };

  const startLoop = () => {
    if (rafId === 0) rafId = requestAnimationFrame(loop);
  };

  // ---------- build the pixel grid (same math as before) ----------
  const drawPixelText = () => {
    const cols = Math.ceil(width / pixelSize);
    const rows = Math.ceil(height / pixelSize);

    const low = document.createElement('canvas');
    low.width = cols;
    low.height = rows;
    const lowCtx = low.getContext('2d', { willReadFrequently: true });
    if (!lowCtx) return;

    const lowFontSize = fontSize / pixelSize;
    lowCtx.font = `${lowFontSize}px "Instrument Serif", serif`;
    lowCtx.textAlign = 'center';
    lowCtx.textBaseline = 'middle';
    lowCtx.fillStyle = '#fff';
    lowCtx.fillText(text, cols / 2, rows / 2);

    const { data } = lowCtx.getImageData(0, 0, cols, rows);

    const gap = Math.max(1, Math.floor(pixelSize * gapRatio));
    blockSize = Math.max(1, pixelSize - gap);
    offset = Math.floor((pixelSize - blockSize) / 2);

    pixels = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const alpha = data[(row * cols + col) * 4 + 3];
        if (alpha < threshold) continue;
        pixels.push({
          x: col * pixelSize + offset,
          y: row * pixelSize + offset,
          expiresAt: 0,
        });
      }
    }
    render();
  };

  // ---------- hover: light up every pixel within radius ----------
  const handleMove = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const now = performance.now();
    const r2 = hoverRadius * hoverRadius;
    let touched = false;

    for (const p of pixels) {
      const cx = p.x + blockSize / 2;
      const cy = p.y + blockSize / 2;
      const dx = cx - mx;
      const dy = cy - my;
      if (dx * dx + dy * dy <= r2) {
        p.expiresAt = now + hoverDuration;
        touched = true;
      }
    }
    if (touched) startLoop();
  };

  canvas.addEventListener('mousemove', handleMove);

  const loadFont = async () => {
    try {
      await document.fonts.load(`${fontSize}px "Instrument Serif"`);
    } catch (e) {
      console.warn('Instrument Serif failed to load — falling back to serif', e);
    }
    drawPixelText();
  };
  loadFont();

  return () => {
    canvas.removeEventListener('mousemove', handleMove);
    if (rafId) cancelAnimationFrame(rafId);
  };
}, [
  text,
  pixelSize,
  fontSize,
  color,
  backgroundColor,
  width,
  height,
  gapRatio,
  threshold,
  hoverColor,
  hoverRadius,
  hoverDuration,
]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width, height }}
      aria-label={`Pixel art of the text "${text}"`}
    />
  );
};

export default Greeting;