import ComponentType, {
  ImageListObject,
  FullComponentList,
  NodeList,
  ConnectionList,
  SlotList,
  TextList,
  InputList,
  OutputList,
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

class EditorEnvironment {
  public documentId: string;
  private _nextComponentId: number;
  private nodeList: NodeList;
  private slotList: SlotList;
  private connectionList: ConnectionList;
  private textList: TextList;
  private inputList: InputList;
  private outputList: OutputList;
  public static readonly nodeImageList: ImageListObject = preloadNodeImages();
  public static readonly InputImageList: ImageListObject = preloadInputImages();
  public static readonly OutputImageList: ImageListObject =
    preloadOutputImages();
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

  addComponent(component: Component): number {
    switch (component.componentType) {
      case ComponentType.NODE:
        this.nodeList.set(this._nextComponentId, component as NodeComponent);
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
        break;
      case ComponentType.OUTPUT:
        this.outputList.set(
          this._nextComponentId,
          component as OutputComponent
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
          return this.nodeList.delete(componentId);
        case ComponentType.SLOT:
          return this.slotList.delete(componentId);
        case ComponentType.LINE:
          return this.connectionList.delete(componentId);
        case ComponentType.TEXT:
          return this.textList.delete(componentId);
        case ComponentType.INPUT:
          return this.inputList.delete(componentId);
        case ComponentType.OUTPUT:
          return this.outputList.delete(componentId);
        default:
          return false;
      }
    } else {
      return (
        this.nodeList.delete(componentId) ||
        this.slotList.delete(componentId) ||
        this.connectionList.delete(componentId) ||
        this.textList.delete(componentId) ||
        this.inputList.delete(componentId) ||
        this.outputList.delete(componentId)
      );
    }
  }
}
export default EditorEnvironment;
