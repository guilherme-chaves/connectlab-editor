import Point2f from '../types/Point2f';
import Point2i from '../types/Point2i';
import ComponentType, {
  ImageListObject,
  RenderGraph,
  RenderObjectType,
} from '../types/types';
import {
  CircleCollision as CircleCollisionShape,
  Line,
  Point,
  RectCollision,
  Sprite,
  Text,
  Texture,
} from './renderObjects';

export default interface Renderer {
  nodeImages: ImageListObject;
  inputImages: ImageListObject;
  outputImages: ImageListObject;
  ctx?: CanvasRenderingContext2D;
  gl?: WebGL2RenderingContext;
  renderGraph: RenderGraph;
  makeCircleCollision(
    componentId: number,
    position: Point2i,
    radius?: number,
    borderColor?: string
  ): CircleCollisionShape;
  makeLine(
    componentId: number,
    position: Point2i,
    endPosition: Point2i,
    anchors?: Point2f[]
  ): Line;
  makePoint(
    componentId: number,
    position: Point2i,
    parentPosition: Point2i,
    size?: number,
    color?: string,
    colorSelected?: string
  ): Point;
  makeRectCollision(
    componentId: number,
    position: Point2i,
    size: Point2i,
    borderColor?: string
  ): RectCollision;
  makeSprite(
    componentId: number,
    componentType: ComponentType,
    imagePaths: string[],
    position: Point2i,
    currentSpriteId: string
  ): Sprite;
  makeText(
    componentId: number,
    position: Point2i,
    label: string,
    textSize?: number,
    color?: string,
    font?: string
  ): Text;
  makeTexture(
    componentId: number,
    position: Point2i,
    textureSrc: string,
    repeat: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'
  ): Texture;
  removeObject(componentId: number, type: RenderObjectType): boolean;
  draw(): void;
  clear(): void;
  resize(width: number, height: number): void;
}
