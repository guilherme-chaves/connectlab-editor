import Renderer from '../../interfaces/renderer';
import Point2i from '../../types/Point2i';
import ComponentType, {
  ImageListObject,
  RenderGraph,
  RenderObjectType,
} from '../../types/types';
import {
  inputImageList,
  nodeImageList,
  outputImageList,
} from './imageListObjects';
import RenderObject, {CollisionShape} from '../../interfaces/renderObjects';
import CircleCollisionShape from './objects/CircleCollision';
import Line from './objects/Line';
import Point from './objects/Point';
import Sprite from './objects/Sprite';
import Text from './objects/Text';
import Texture from './objects/Texture';
import preload from './preload';
import RectCollision from './objects/RectCollision';
import Point2f from '../../types/Point2f';

export default class CanvasRenderer implements Renderer {
  public ctx: CanvasRenderingContext2D;
  public readonly nodeImages: ImageListObject;
  public readonly inputImages: ImageListObject;
  public readonly outputImages: ImageListObject;
  public readonly renderGraph: RenderGraph;

  constructor(canvas: HTMLCanvasElement) {
    this.renderGraph = {
      textures: new Map(),
      sprites: new Map(),
      lines: new Map(),
      texts: new Map(),
      points: new Map(),
      rectCollisions: new Map(),
      circleCollisions: new Map(),
    };
    this.nodeImages = preload.imageList(nodeImageList);
    this.inputImages = preload.imageList(inputImageList);
    this.outputImages = preload.imageList(outputImageList);
    this.ctx = this.createContext(canvas);
  }

  private createContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    return canvas.getContext('2d')!;
  }

  makeCircleCollision(
    componentId: number,
    position: Point2i,
    radius?: number,
    borderColor?: string
  ): CircleCollisionShape {
    const newCC = new CircleCollisionShape(position, radius, borderColor);
    const currentArr = this.renderGraph.circleCollisions.get(componentId) ?? [];
    currentArr.push(newCC);
    this.renderGraph.circleCollisions.set(componentId, currentArr);
    return newCC;
  }

  makeLine(
    componentId: number,
    position: Point2i,
    endPosition: Point2i,
    anchors?: Point2f[]
  ): Line {
    const newLine = new Line(position, endPosition, anchors);
    this.renderGraph.lines.set(componentId, newLine);
    return newLine;
  }

  makePoint(
    componentId: number,
    position: Point2i,
    parentPosition: Point2i,
    size?: number,
    color?: string,
    colorSelected?: string
  ): Point {
    const newPoint = new Point(
      position,
      parentPosition,
      size,
      color,
      colorSelected
    );
    this.renderGraph.points.set(componentId, newPoint);
    return newPoint;
  }

  makeRectCollision(
    componentId: number,
    position: Point2i,
    size: Point2i,
    borderColor?: string
  ): RectCollision {
    const newRC = new RectCollision(position, size, borderColor);
    const currentArr = this.renderGraph.rectCollisions.get(componentId) ?? [];
    currentArr.push(newRC);
    this.renderGraph.rectCollisions.set(componentId, currentArr);
    return newRC;
  }

  makeSprite(
    componentId: number,
    componentType: ComponentType,
    imagePaths: string[],
    position: Point2i,
    currentSpriteId: string
  ): Sprite {
    let newSprite: Sprite;
    switch (componentType) {
      case ComponentType.INPUT:
        newSprite = new Sprite(
          position,
          preload.getImageSublist(this.inputImages, imagePaths),
          currentSpriteId,
          this.ctx.canvas.width,
          this.ctx.canvas.height
        );
        break;
      case ComponentType.OUTPUT:
        newSprite = new Sprite(
          position,
          preload.getImageSublist(this.outputImages, imagePaths),
          currentSpriteId,
          this.ctx.canvas.width,
          this.ctx.canvas.height
        );
        break;
      default:
        newSprite = new Sprite(
          position,
          preload.getImageSublist(this.nodeImages, imagePaths),
          currentSpriteId,
          this.ctx.canvas.width,
          this.ctx.canvas.height
        );
        break;
    }
    this.renderGraph.sprites.set(componentId, newSprite);
    return newSprite;
  }

  makeText(
    componentId: number,
    position: Point2i,
    label: string,
    textSize?: number,
    color?: string,
    font?: string
  ): Text {
    const newText = new Text(position, label, textSize, color, font);
    this.renderGraph.texts.set(componentId, newText);
    return newText;
  }

  makeTexture(
    componentId: number,
    position: Point2i,
    textureSrc: string,
    repeat: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'
  ): Texture {
    const newTexture = new Texture(position, textureSrc, this, repeat);
    this.renderGraph.textures.set(componentId, newTexture);
    return newTexture;
  }

  removeObject(componentId: number, type: RenderObjectType): boolean {
    switch (type) {
      case RenderObjectType.CIRCLE_COLLISION:
        return this.renderGraph.circleCollisions.delete(componentId);
      case RenderObjectType.LINE:
        return this.renderGraph.lines.delete(componentId);
      case RenderObjectType.POINT:
        return this.renderGraph.points.delete(componentId);
      case RenderObjectType.RECT_COLLISION:
        return this.renderGraph.rectCollisions.delete(componentId);
      case RenderObjectType.SPRITE:
        return this.renderGraph.sprites.delete(componentId);
      case RenderObjectType.TEXT:
        return this.renderGraph.texts.delete(componentId);
      case RenderObjectType.TEXTURE:
        return this.renderGraph.textures.delete(componentId);
      default:
        return false;
    }
  }

  draw(): void {
    this.clear();
    for (const [, value] of Object.entries(this.renderGraph)) {
      for (let i = 0; i < value.size; i++) {
        if (Array.isArray(value)) {
          for (let j = 0; j < (value.get(i) as CollisionShape[])?.length; j++) {
            (value.get(i) as CollisionShape[])[j].draw(this.ctx);
          }
        } else {
          (value.get(i) as RenderObject | Line | undefined)?.draw(this.ctx);
        }
      }
    }
  }

  clear(): void {
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.restore();
  }

  resize(width: number, height: number): void {
    this.ctx.canvas.width = width;
    this.ctx.canvas.height = height;
  }
}
