import type { Pixel } from './types'; 

export class PixelTextRenderer {
  private ctx: CanvasRenderingContext2D;
  private pixels: Pixel[];
  private width: number;
  private height: number;
  private rafId = 0;
  private running = false;
  private lastTime = 0;

  constructor(canvas: HTMLCanvasElement, pixels: Pixel[]) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D context');
    this.ctx = ctx;
    this.pixels = pixels;
    this.width = canvas.width;
    this.height = canvas.height;
  }


  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.frame);
  }
  stop() {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  private frame = (time: number) => {
    if (!this.running) return;
    const dt = (time - this.lastTime) / 1000; // seconds
    this.lastTime = time;

    this.update(dt);
    this.draw();

    this.rafId = requestAnimationFrame(this.frame);
  };
  private update(_dt: number) {
    for (const p of this.pixels) {
    // Advance the morph cycle
    p.shapePhase += p.shapeSpeed * _dt; 

    if (p.shapePhase >= 1) {
      p.shapePhase = 0;

      // Cycle to the next shape in the set
      const idx = p.shapeSet.indexOf(p.shape);
      p.shape = p.shapeSet[(idx + 1) % p.shapeSet.length];
    }
  }
  }
  private draw() {
    const { ctx, pixels, width, height } = this;
    ctx.clearRect(0, 0, width, height);
    for (const p of pixels) {
      // ctx.fillStyle = p.color;
      // ctx.fillRect(p.x, p.y, p.size, p.size); 
      const s = p.size;
      const cx = p.x + s / 2;
      const cy = p.y + s / 2;
  
      ctx.fillStyle = p.color;
  
    switch (p.shape) {
      case 'square':
        ctx.fillRect(p.x, p.y, s, s);
        break;
  
      case 'circle':
        ctx.beginPath();
        ctx.arc(cx, cy, s / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
  
      case 'cross': {
        const t = Math.max(1, Math.floor(s / 3)); // thickness
        ctx.fillRect(p.x, cy - t / 2, s, t);      // horizontal bar
        ctx.fillRect(cx - t / 2, p.y, t, s);      // vertical bar
        break;
      }
  
      case 'diamond':
        ctx.beginPath();
        ctx.moveTo(cx, p.y);
        ctx.lineTo(p.x + s, cy);
        ctx.lineTo(cx, p.y + s);
        ctx.lineTo(p.x, cy);
        ctx.closePath();
        ctx.fill();
        break;
  
      case 'rect':
        // narrower rectangle, e.g., 60% width, full height
        ctx.fillRect(p.x, p.y, s * 0.6, s);
        break;
    }
    }
  }
}