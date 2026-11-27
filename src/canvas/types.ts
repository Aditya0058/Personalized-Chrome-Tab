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
} 