import ConnectionComponent from '../../components/ConnectionComponent';
import Component from '../../interfaces/componentInterface';
import Node from '../../interfaces/nodeInterface';
import RenderObject from '../../interfaces/renderObjects';
import Renderer from '../../interfaces/renderer';
import ComponentType, {
  ImageListObject,
  RenderGraph,
  SignalGraph,
} from '../../types/types';
import {
  inputImageList,
  nodeImageList,
  outputImageList,
} from './imageListObjects';
import Line from './objects/Line';
import Sprite from './objects/Sprite';
import preload from './preload';

export default class CanvasRenderer implements Renderer {
  public ctx: CanvasRenderingContext2D;
  private nodeImages: ImageListObject;
  private inputImages: ImageListObject;
  private outputImages: ImageListObject;
  public readonly renderGraph: RenderGraph;
  private readonly _signalGraph: SignalGraph;

  constructor(canvas: HTMLCanvasElement, signalGraph: SignalGraph) {
    this.renderGraph = new Map();
    this._signalGraph = signalGraph;
    this.nodeImages = preload.imageList(nodeImageList);
    this.inputImages = preload.imageList(inputImageList);
    this.outputImages = preload.imageList(outputImageList);
    this.ctx = this.createContext(canvas);
  }

  private createContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    return canvas.getContext('2d')!;
  }

  update(): void {
    
  }

  addElement(component: Component): void {
    switch (component.componentType) {
      case ComponentType.NODE:
      case ComponentType.OUTPUT:
        this.renderGraph.set(
          component.id,
          new Sprite(component.position, this.inputImages)
        );
        break;
      case ComponentType.INPUT:
        this.renderGraph.set(
          component.id,
          new Sprite(component.position, this.inputImages)
        );
        break;
      case ComponentType.LINE:
        // eslint-disable-next-line no-case-declarations
        const connection = component as unknown as ConnectionComponent;
        this.renderGraph.set(
          component.id,
          new Line(
            connection.position,
            connection.endPosition,
            connection.anchors
          )
        );
        break;
      case ComponentType.TEXT:
        this.renderGraph.set(component.id, {
          type: component.componentType,
          text: data?.text ?? {label: ''},
        });
        break;
      case ComponentType.SLOT:
        this.renderGraph.set(component.id, {type: component.componentType});
        break;
    }
  }

  updateElement(id: number, newObject: RenderObject): void {
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
}
