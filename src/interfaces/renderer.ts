import {RenderGraph} from '../types/types';
import Component from './componentInterface';
import RenderObject from './renderObjects';

export default interface Renderer {
  ctx?: CanvasRenderingContext2D;
  gl?: WebGL2RenderingContext;
  renderGraph: RenderGraph;
  addElement(component: Component): void;
  updateElement(id: number, newObject: RenderObject): void;
  removeElement(id: number): boolean;
  update(): void;
}
