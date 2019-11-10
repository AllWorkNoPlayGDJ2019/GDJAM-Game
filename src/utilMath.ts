
import * as PIXI from 'pixi.js'

export class utilMath {

    // returns linear interpolation of p1 to p2, with interplation parameter t
    static lerp(p1: number, p2: number, t: number) {
        return p1 + (p2 - p1) * t;   // The function returns the product of p1 and p2
      }

          // returns linear interpolation of p1 to p2, with interplation parameter t
    static lerpPoint(p1: PIXI.IPoint, p2: PIXI.IPoint, t: number) {
        return new PIXI.Point(p1.x + (p2.x - p1.x) * t, p1.y + (p2.y - p1.y) * t);   // The function returns the product of p1 and p2
      }
}