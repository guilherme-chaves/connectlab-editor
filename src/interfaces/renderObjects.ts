import Point2f from '../types/Point2f';
import Point2i from '../types/Point2i';
import {ImageListObject} from '../types/types';

export default interface RenderObject {
  position: Point2i;
  selected: boolean;
  draw(ctx: CanvasRenderingContext2D): void;
  move(nPos: Point2i, isDelta: boolean): void;
}

export interface Line extends Omit<RenderObject, 'move'> {
  endPosition: Point2i;
  anchors: Array<Point2f>;
  move(nPos: Point2i, isDelta: boolean, movePoint: 0 | 1 | 2): void;
}

export interface Sprite extends RenderObject {
  imageSet: ImageListObject;
  currentSpriteId: string;
}

export interface Texture extends RenderObject {
  image: ImageBitmap | undefined;
  repeat: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';
}

export interface Point extends RenderObject {
  size: number;
  color: string;
  colorSelected: string;
}

export interface Text extends RenderObject {
  label: string;
  textSize: number;
  color: string;
  font: string;
}

export interface CollisionShape extends Omit<RenderObject, 'collisionShapes'> {
  display: boolean;
  borderColor: string;
}

export interface RectCollision extends CollisionShape {
  size: Point2i;
}

export interface CircleCollision extends CollisionShape {
  radius: number;
}
