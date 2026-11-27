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
    // nothing yet — pixels are already sitting at homeX/homeY
  }
  private draw() {
    const { ctx, pixels, width, height } = this;
    ctx.clearRect(0, 0, width, height);
    for (const p of pixels) {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size); 
    }
  }
}