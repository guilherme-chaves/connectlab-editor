import BBCollision from '../collision/BBCollision';
import CircleCollision from '../collision/CircleCollision';
import ConnectionComponent from '../components/ConnectionComponent';
import Point2i from '../types/Point2i';
import {ImageListObject, RenderGraph, RenderGraphData} from '../types/types';
import Component from './componentInterface';

export default interface Renderer {
  nodeImages: ImageListObject;
  inputImages: ImageListObject;
  outputImages: ImageListObject;
  ctx?: CanvasRenderingContext2D;
  gl?: WebGL2RenderingContext;
  renderGraph: RenderGraph;
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
  ): void;
  updateElement(id: number, newObject: RenderGraphData): void;
  removeElement(id: number): boolean;
  draw(): void;
  clear(): void;
  resize(width: number, height: number): void;
}
