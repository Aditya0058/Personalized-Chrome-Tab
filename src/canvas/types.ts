export interface Pixel {
  x: number;        // current position
  y: number;
  homeX: number;    // position it "belongs" to (the text)
  homeY: number;
  color: string;
  size: number;
  vx?: number;       
  vy?: number;
}

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