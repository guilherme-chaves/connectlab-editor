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
import preloadNodeImages from './functions/Node/preloadNodeImages';
import {
  preloadInputImages,
  preloadOutputImages,
} from './functions/IO/preloadIOImages';
import {
  removeNode,
  removeSlot,
  removeConnection,
  removeInput,
  removeOutput,
  removeText,
} from './functions/Component/removeComponent';

class EditorEnvironment {
  public documentId: string;
  private _nextComponentId: number;
  public nodes: NodeList;
  public slots: SlotList;
  public connections: ConnectionList;
  public texts: TextList;
  public inputs: InputList;
  public outputs: OutputList;
  public readonly nodeImageList: ImageListObject;
  public readonly inputImageList: ImageListObject;
  public readonly outputImageList: ImageListObject;
  public signalGraph: SignalGraph;

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
    this.nodes = nodeList;
    this.slots = slotList;
    this.connections = connectionList;
    this.texts = textList;
    this.inputs = inputList;
    this.outputs = outputList;
    this.signalGraph = new Map();
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
      nodes: this.nodes,
      slots: this.slots,
      connections: this.connections,
      texts: this.texts,
      inputs: this.inputs,
      outputs: this.outputs,
    };
  }

  get nextComponentId(): number {
    return this._nextComponentId;
  }

  updateComponentId(): number {
    const ret = this._nextComponentId;
    this._nextComponentId++;
    return ret;
  }

  removeComponent(
    componentId: number = this._nextComponentId - 1,
    type?: ComponentType
  ): boolean {
    if (type) {
      switch (type) {
        case ComponentType.NODE:
          return removeNode(this, componentId);
        case ComponentType.SLOT:
          return removeSlot(this, componentId);
        case ComponentType.LINE:
          return removeConnection(this, componentId);
        case ComponentType.TEXT:
          return removeText(this, componentId);
        case ComponentType.INPUT:
          return removeInput(this, componentId);
        case ComponentType.OUTPUT:
          return removeOutput(this, componentId);
        default:
          return false;
      }
    } else {
      const component =
        this.connections.get(componentId) ??
        this.nodes.get(componentId) ??
        this.inputs.get(componentId) ??
        this.outputs.get(componentId) ??
        this.slots.get(componentId) ??
        this.texts.get(componentId);
      if (component !== undefined)
        return this.removeComponent(component.id, component.componentType);
      else return false;
    }
  }
}
export default EditorEnvironment;
