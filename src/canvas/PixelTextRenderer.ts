import type { Pixel } from './types';

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h * 12) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

function randomRainbow(): [number, number, number] {
  return hslToRgb(Math.random(), 1, 0.6);
}

export class PixelTextRenderer {
  private ctx: CanvasRenderingContext2D;
  private pixels: Pixel[];
  private width: number;
  private height: number;
  private rafId = 0;
  private running = false;
  private lastTime = 0;
  private mouseX: number | null = null;
  private mouseY: number | null = null;
  private hoverRadius: number;
  private hoverReturnSpeed: number;

  constructor(
    canvas: HTMLCanvasElement,
    pixels: Pixel[],
    opts: { hoverRadius?: number; hoverReturnSpeed?: number } = {}
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D context');
    this.ctx = ctx;
    this.pixels = pixels;
    this.width = canvas.width;
    this.height = canvas.height;
    this.hoverRadius = opts.hoverRadius ?? 30;
    this.hoverReturnSpeed = opts.hoverReturnSpeed ?? 6;
  }

  setMouse(x: number | null, y: number | null) {
    this.mouseX = x;
    this.mouseY = y;
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
    const dt = Math.min((time - this.lastTime) / 1000, 0.05); // clamp for tab-switch spikes
    this.lastTime = time;

    this.update(dt);
    this.draw();

    this.rafId = requestAnimationFrame(this.frame);
  };

  private update(dt: number) {
    const mx = this.mouseX;
    const my = this.mouseY;
    const r2 = this.hoverRadius * this.hoverRadius;
    const t = Math.min(1, this.hoverReturnSpeed * dt); // ← now `dt` exists ✅
    const mouseActive = mx !== null && my !== null;

    for (const p of this.pixels) {
      // ── Shape morph cycle ──
      p.shapePhase += p.shapeSpeed * dt;
      if (p.shapePhase >= 1) {
        p.shapePhase = 0;
        const idx = p.shapeSet.indexOf(p.shape);
        p.shape = p.shapeSet[(idx + 1) % p.shapeSet.length];
      }

      // ── Hover state machine ──
      if (mouseActive) {
        const dx = p.x + p.size / 2 - mx!;
        const dy = p.y + p.size / 2 - my!;
        const inside = dx * dx + dy * dy < r2;

        if (inside && !p.hovered) {
          p.hovered = true;
          const [rr, gg, bb] = randomRainbow();
          p.r = rr; p.g = gg; p.b = bb;
        } else if (!inside && p.hovered) {
          p.hovered = false;
        }
      } else if (p.hovered) {
        p.hovered = false;
      }

      // ── Return to base color when not hovered ──
      if (!p.hovered) {
        p.r += (p.baseR - p.r) * t;
        p.g += (p.baseG - p.g) * t;
        p.b += (p.baseB - p.b) * t;
      }
    }
  }

  private draw() {
    const { ctx, pixels, width, height } = this;
    ctx.clearRect(0, 0, width, height);

    for (const p of pixels) {
      ctx.fillStyle = `rgb(${p.r | 0},${p.g | 0},${p.b | 0})`; // ← only fillStyle
      const s = p.size;
      const cx = p.x + s / 2;
      const cy = p.y + s / 2;

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
          const th = Math.max(1, Math.floor(s / 3));
          ctx.fillRect(p.x, cy - th / 2, s, th);
          ctx.fillRect(cx - th / 2, p.y, th, s);
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
          ctx.fillRect(p.x, p.y, s * 0.6, s);
          break;
      }
    }
  }
}