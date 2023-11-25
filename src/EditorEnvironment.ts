import ComponentType, {
  ImageListObject,
  componentListInterface,
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
    nodeList = {},
    slotList = {},
    connectionList = {},
    textList = {},
    inputList = {},
    outputList = {}
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

  get components(): componentListInterface {
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

  addComponent(component: Component) {
    switch (component.componentType) {
      case ComponentType.NODE:
        this.nodeList[this._nextComponentId] = component as NodeComponent;
        break;
      case ComponentType.SLOT:
        this.slotList[this._nextComponentId] = component as SlotComponent;
        break;
      case ComponentType.LINE:
        this.connectionList[this._nextComponentId] =
          component as ConnectionComponent;
        break;
      case ComponentType.TEXT:
        this.textList[this._nextComponentId] = component as TextComponent;
        break;
      case ComponentType.INPUT:
        this.inputList[this._nextComponentId] = component as InputComponent;
        break;
      case ComponentType.OUTPUT:
        this.outputList[this._nextComponentId] = component as OutputComponent;
        break;
    }
    this._nextComponentId += 1;
    return this._nextComponentId - 1;
  }

  removeComponent(
    componentId: number = this._nextComponentId - 1,
    type?: ComponentType
  ): void {
    if (type) {
      switch (type) {
        case ComponentType.NODE:
          delete this.nodeList[componentId];
          break;
        case ComponentType.SLOT:
          delete this.slotList[componentId];
          break;
        case ComponentType.LINE:
          delete this.connectionList[componentId];
          break;
        case ComponentType.TEXT:
          delete this.textList[componentId];
          break;
        case ComponentType.INPUT:
          delete this.inputList[componentId];
          break;
        case ComponentType.OUTPUT:
          delete this.outputList[componentId];
          break;
      }
    } else {
      if (Object.prototype.hasOwnProperty.call(this.nodeList, componentId))
        delete this.nodeList[componentId];
      if (Object.prototype.hasOwnProperty.call(this.slotList, componentId))
        delete this.slotList[componentId];
      if (
        Object.prototype.hasOwnProperty.call(this.connectionList, componentId)
      )
        delete this.connectionList[componentId];
      if (Object.prototype.hasOwnProperty.call(this.textList, componentId))
        delete this.textList[componentId];
      if (Object.prototype.hasOwnProperty.call(this.inputList, componentId))
        delete this.inputList[componentId];
      if (Object.prototype.hasOwnProperty.call(this.outputList, componentId))
        delete this.outputList[componentId];
    }
  }
}
export default EditorEnvironment;
