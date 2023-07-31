interface Vector2 {
  x: number;
  y: number;
}

class Vector2 {
  constructor(xOrVector2: number | Vector2, y: number = 0, forceFloat = false) {
    if (typeof xOrVector2 === 'number') {
      if (forceFloat) {
        this.x = xOrVector2;
        this.y = y;
      } else {
        this.x = Math.floor(xOrVector2);
        this.y = Math.floor(y);
      }
    } else {
      this.x = xOrVector2.x;
      this.y = xOrVector2.y;
    }
  }

  add(other: Vector2, forceFloat = false): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y, forceFloat);
  }

  minus(other: Vector2, forceFloat = false): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y, forceFloat);
  }

  multS(s: number, forceFloat = false): Vector2 {
    return new Vector2(this.x * s, this.y * s, forceFloat);
  }

  mult(other: Vector2, forceFloat = false) {
    return new Vector2(this.x * other.x, this.y * other.y, forceFloat);
  }

  div(other: Vector2, forceFloat = false) {
    return new Vector2(this.x / other.x, this.y / other.y, forceFloat);
  }

  divS(s: number, forceFloat = false) {
    return new Vector2(this.x / s, this.y / s, forceFloat);
  }

  dot(other: Vector2): number {
    return this.x * other.x + this.y * other.y;
  }

  cross(other: Vector2): number {
    return this.x * other.y - this.y * other.x;
  }

  magSq(): number {
    return this.dot(this);
  }

  madd(other: Vector2, s: number, forceFloat = false) {
    return new Vector2(this.x + s * other.x, this.y + s * other.y, forceFloat);
  }

  // Interpolação linear
  lerp(other: Vector2, t: number, forceFloat = false) {
    return this.madd(other.minus(this), t, forceFloat);
  }

  // Interpolação bilinear
  bilinear(other: Vector2, bt: Vector2, forceFloat = false) {
    return new Vector2(
      this.lerp(other, bt.x, forceFloat).x,
      this.lerp(other, bt.y, forceFloat).y,
      forceFloat
    );
  }

  equals(other: Vector2): boolean {
    return this.x === other.x && this.y === other.y;
  }

  inBounds(
    top: number,
    left: number,
    bottom: number,
    right: number,
    forceFloat = false
  ): Vector2 {
    return new Vector2(
      Math.min(Math.max(this.x, left), right),
      Math.min(Math.max(this.y, top), bottom),
      forceFloat
    );
  }

  rotateZ(angle: number): Vector2 {
    const sin = Math.sin(angle)
    const cos = Math.cos(angle)
    return new Vector2(this.x * cos - this.y * sin, this.x * sin + this.y * cos)
  }
}

export default Vector2;
