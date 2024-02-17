import Component from '../../interfaces/componentInterface';
import Node from '../../interfaces/nodeInterface';
import Renderer from '../../interfaces/renderer';
import Point2i from '../../types/Point2i';
import ComponentType, {
  ImageListObject,
  RenderGraph,
  RenderGraphData,
  RenderObjectType,
} from '../../types/types';
import {
  inputImageList,
  nodeImageList,
  outputImageList,
} from './imageListObjects';
import CircleCollisionShape from './objects/CircleCollision';
import CircleCollision from '../../collision/CircleCollision';
import Line from './objects/Line';
import Point from './objects/Point';
import Sprite from './objects/Sprite';
import Text from './objects/Text';
import Texture from './objects/Texture';
import preload from './preload';
import RectCollision from './objects/RectCollision';
import BBCollision from '../../collision/BBCollision';
import ConnectionComponent from '../../components/ConnectionComponent';
import SlotComponent from '../../components/SlotComponent';

export default class CanvasRenderer implements Renderer {
  public ctx: CanvasRenderingContext2D;
  public readonly nodeImages: ImageListObject;
  public readonly inputImages: ImageListObject;
  public readonly outputImages: ImageListObject;
  public readonly renderGraph: RenderGraph;

  constructor(canvas: HTMLCanvasElement) {
    this.renderGraph = new Map();
    this.nodeImages = preload.imageList(nodeImageList);
    this.inputImages = preload.imageList(inputImageList);
    this.outputImages = preload.imageList(outputImageList);
    this.ctx = this.createContext(canvas);
  }

  private createContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    return canvas.getContext('2d')!;
  }

  draw(): void {
    this.clear();
    for (const element of this.renderGraph) {
      switch (element[1].type) {
        case RenderObjectType.LINE:
          element[1].line!.draw(this.ctx);
          break;
        default:
          element[1].object!.draw(this.ctx);
      }
    }
  }

  clear(): void {
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.restore();
  }

  addElement(
    component?: Component,
    textureData?: {
      src: string;
      position: Point2i;
      repeat: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';
    },
    textData?: {label: string; size: number; color: string; font: string},
    connectionComponent?: ConnectionComponent,
    collisionData?: {
      componentId: number;
      shapes: [BBCollision[], CircleCollision[]];
    }
  ): void {
    if (!component && textureData) {
      this.renderGraph.set(this.renderGraph.size + 1, {
        type: RenderObjectType.TEXTURE,
        object: new Texture(
          textureData.position,
          textureData.src,
          this,
          textureData.repeat
        ),
      });
      return;
    }
    switch (component?.componentType) {
      case ComponentType.NODE:
        this.renderGraph.set(component.id, {
          type: RenderObjectType.SPRITE,
          object: new Sprite(
            component.position,
            this.nodeImages,
            (component as Node).nodeType.imgPaths[0],
            undefined,
            this.ctx.canvas.width,
            this.ctx.canvas.height
          ),
        });
        break;
      case ComponentType.OUTPUT:
        this.renderGraph.set(component.id, {
          type: RenderObjectType.SPRITE,
          object: new Sprite(
            component.position,
            this.outputImages,
            (component as Node).nodeType.imgPaths[0],
            undefined,
            this.ctx.canvas.width,
            this.ctx.canvas.height
          ),
        });
        break;
      case ComponentType.INPUT:
        this.renderGraph.set(component.id, {
          type: RenderObjectType.SPRITE,
          object: new Sprite(
            component.position,
            this.inputImages,
            (component as Node).nodeType.imgPaths[0],
            undefined,
            this.ctx.canvas.width,
            this.ctx.canvas.height
          ),
        });
        break;
      case ComponentType.LINE:
        if (connectionComponent)
          this.renderGraph.set(component.id, {
            type: RenderObjectType.LINE,
            line: new Line(
              connectionComponent.position,
              connectionComponent.endPosition,
              connectionComponent.anchors
            ),
          });
        break;
      case ComponentType.TEXT:
        if (textData)
          this.renderGraph.set(component.id, {
            type: RenderObjectType.TEXT,
            object: new Text(
              component.position,
              textData.label,
              textData.size,
              textData.color,
              textData.font,
              undefined
            ),
          });
        break;
      case ComponentType.SLOT:
        this.renderGraph.set(component.id, {
          type: RenderObjectType.POINT,
          object: new Point(
            component.position,
            (component as SlotComponent).parent.position,
            4,
            undefined,
            undefined,
            undefined
          ),
        });
        break;
    }
    if (!component && collisionData) {
      const comp = this.renderGraph.get(collisionData.componentId);
      switch (comp?.type) {
        case RenderObjectType.POINT:
          comp.object!.collisionShapes.clear();
          for (let i = 0; i < collisionData.shapes[1].length; i++) {
            comp.object!.collisionShapes.add(
              new CircleCollisionShape(
                collisionData.shapes[1][i].position,
                collisionData.shapes[1][i].radius,
                undefined,
                collisionData.shapes[1][i]
              )
            );
          }
          break;
        case RenderObjectType.LINE:
          comp.line!.collisionShapes.clear();
          for (let i = 0; i < collisionData.shapes[0].length; i++) {
            comp.line!.collisionShapes.add(
              new RectCollision(
                collisionData.shapes[0][i].position,
                collisionData.shapes[0][i].size,
                collisionData.shapes[0][i]
              )
            );
          }
          break;
        case RenderObjectType.SPRITE:
        case RenderObjectType.TEXT:
        case RenderObjectType.TEXTURE:
          comp.object!.collisionShapes.clear();
          for (let i = 0; i < collisionData.shapes[0].length; i++) {
            comp.object!.collisionShapes.add(
              new RectCollision(
                collisionData.shapes[0][i].position,
                collisionData.shapes[0][i].size,
                collisionData.shapes[0][i]
              )
            );
          }
      }
    }
  }

  updateElement(id: number, newObject: RenderGraphData): void {
    if (this.renderGraph.has(id)) {
      this.renderGraph.set(id, newObject);
    } else {
      console.warn(
        `Elemento ${id} não existe dentro do grafo do renderizador. Ignorando...`
      );
    }
  }

  removeElement(id: number): boolean {
    return this.renderGraph.delete(id);
  }

  resize(width: number, height: number): void {
    this.ctx.canvas.width = width;
    this.ctx.canvas.height = height;
  }
}
