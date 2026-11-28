export interface Pixel {
  x: number;        // current position
  y: number;
  homeX: number;    // position it "belongs" to (the text)
  homeY: number;
  color: string;
  size: number;
  shape: Shape;        // current shape being drawn
  shapePhase: number;  // 0..1 progress through the current shape transition
  shapeSpeed: number;  // how fast this pixel morphs (unique per pixel)
  vx?: number;       
  vy?: number;
  shapeSet: Shape[];
  r: number;
  g: number;
  b: number;
  baseR: number;   // original color, restored after hover
  baseG: number;
  baseB: number;

  hovered: boolean;
}
type Shape = 'square' | 'circle' | 'cross' | 'diamond' | 'rect';
export interface SampleOptions {
  width: number;
  height: number;
  fontSize: number;
  fontFamily?: string;
  fontWeight?: string; 
  threshold?: number;
  color?: string;
  step?: number; 
  hoverRadius?: number;   // px, default 30
  hoverReturnSpeed?: number; // 0..1 per second, default 6
} 