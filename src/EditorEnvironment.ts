import ComponentType, {
  ImageListObject,
  FullComponentList,
  NodeList,
  ConnectionList,
  SlotList,
  TextList,
  InputList,
  OutputList,
  SignalGraph,
} from './types/types';
import ConnectionComponent from './components/ConnectionComponent';
import NodeComponent from './components/NodeComponent';
import SlotComponent from './components/SlotComponent';
import TextComponent from './components/TextComponent';
import preloadNodeImages from './functions/Node/preloadNodeImages';
import {
  preloadInputImages,
  preloadOutputImages,
} from './functions/IO/preloadIOImages';
import Component from './interfaces/componentInterface';
import InputComponent from './components/InputComponent';
import OutputComponent from './components/OutputComponent';
import signalEvents from './functions/Signal/signalEvents';

class EditorEnvironment {
  public documentId: string;
  private _nextComponentId: number;
  private nodeList: NodeList;
  private slotList: SlotList;
  private connectionList: ConnectionList;
  private textList: TextList;
  private inputList: InputList;
  private outputList: OutputList;
  public readonly nodeImageList: ImageListObject;
  public readonly inputImageList: ImageListObject;
  public readonly outputImageList: ImageListObject;
  private _signalGraph: SignalGraph;

  constructor(
    documentId: string,
    startId = 0,
    nodeList = new Map(),
    slotList = new Map(),
    connectionList = new Map(),
    textList = new Map(),
    inputList = new Map(),
    outputList = new Map()
  ) {
    this.documentId = documentId;
    this._nextComponentId = startId;
    this.nodeList = nodeList;
    this.slotList = slotList;
    this.connectionList = connectionList;
    this.textList = textList;
    this.inputList = inputList;
    this.outputList = outputList;
    this._signalGraph = new Map();
    this.nodeImageList = preloadNodeImages();
    this.inputImageList = preloadInputImages();
    this.outputImageList = preloadOutputImages();
  }

  /* Getters e Setters */

  getDocumentId(): string {
    return this.documentId;
  }

  get components(): FullComponentList {
    return {
      nodes: this.nodeList,
      slots: this.slotList,
      connections: this.connectionList,
      texts: this.textList,
      inputs: this.inputList,
      outputs: this.outputList,
    };
  }

  get nodes(): NodeList {
    return this.nodeList;
  }

  get slots(): SlotList {
    return this.slotList;
  }

  get connections(): ConnectionList {
    return this.connectionList;
  }

  get texts(): TextList {
    return this.textList;
  }

  get inputs(): InputList {
    return this.inputList;
  }

  get outputs(): OutputList {
    return this.outputList;
  }

  get nextComponentId(): number {
    return this._nextComponentId;
  }

  get signalGraph(): SignalGraph {
    return this._signalGraph;
  }

  addComponent(component: Component): number {
    switch (component.componentType) {
      case ComponentType.NODE:
        this.nodeList.set(this._nextComponentId, component as NodeComponent);
        signalEvents.addVertex(
          this,
          this._nextComponentId,
          undefined,
          signalEvents.convertToSignalFromList(
            this,
            this._nextComponentId,
            ComponentType.NODE
          )
        );
        break;
      case ComponentType.SLOT:
        this.slotList.set(this._nextComponentId, component as SlotComponent);
        break;
      case ComponentType.LINE:
        this.connectionList.set(
          this._nextComponentId,
          component as ConnectionComponent
        );
        break;
      case ComponentType.TEXT:
        this.textList.set(this._nextComponentId, component as TextComponent);
        break;
      case ComponentType.INPUT:
        this.inputList.set(this._nextComponentId, component as InputComponent);
        signalEvents.addVertex(
          this,
          this._nextComponentId,
          undefined,
          signalEvents.convertToSignalFromList(
            this,
            this._nextComponentId,
            ComponentType.INPUT
          )
        );
        break;
      case ComponentType.OUTPUT:
        this.outputList.set(
          this._nextComponentId,
          component as OutputComponent
        );
        signalEvents.addVertex(
          this,
          this._nextComponentId,
          undefined,
          signalEvents.convertToSignalFromList(
            this,
            this._nextComponentId,
            ComponentType.OUTPUT
          )
        );
        break;
    }
    console.log(component);
    this._nextComponentId += 1;
    return this._nextComponentId - 1;
  }

  removeComponent(
    componentId: number = this._nextComponentId - 1,
    type?: ComponentType
  ): boolean {
    if (type) {
      switch (type) {
        case ComponentType.NODE:
          signalEvents.removeVertex(this, componentId);
          return this.nodeList.delete(componentId);
        case ComponentType.SLOT:
          return this.slotList.delete(componentId);
        case ComponentType.LINE:
          signalEvents.removeEdge(this, this.connectionList.get(componentId));
          return this.connectionList.delete(componentId);
        case ComponentType.TEXT:
          return this.textList.delete(componentId);
        case ComponentType.INPUT:
          signalEvents.removeVertex(this, componentId);
          return this.inputList.delete(componentId);
        case ComponentType.OUTPUT:
          signalEvents.removeVertex(this, componentId);
          return this.outputList.delete(componentId);
        default:
          return false;
      }
    } else {
      const component =
        this.connectionList.get(componentId) ??
        this.nodeList.get(componentId) ??
        this.inputList.get(componentId) ??
        this.outputList.get(componentId) ??
        this.slotList.get(componentId) ??
        this.textList.get(componentId);
      if (component !== undefined)
        return this.removeComponent(component.id, component.componentType);
      else return false;
    }
  }
}
export default EditorEnvironment;
