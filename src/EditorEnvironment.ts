import ComponentType, {
  ImageListObject,
  FullComponentList,
  NodeList,
  ConnectionList,
  SlotList,
  TextList,
  SignalGraph,
} from './types/types';
import preloadNodeImages from './functions/Node/preloadNodeImages';
import {
  removeNode,
  removeSlot,
  removeConnection,
  removeText,
} from './functions/Component/removeComponent';

class EditorEnvironment {
  public documentId: string;
  private _nextComponentId: number;
  public nodes: NodeList;
  public slots: SlotList;
  public connections: ConnectionList;
  public texts: TextList;
  public readonly nodeImageList: ImageListObject;
  public signalGraph: SignalGraph;

  constructor(
    documentId: string,
    startId = 0,
    nodeList = new Map(),
    slotList = new Map(),
    connectionList = new Map(),
    textList = new Map()
  ) {
    this.documentId = documentId;
    this._nextComponentId = startId;
    this.nodes = nodeList;
    this.slots = slotList;
    this.connections = connectionList;
    this.texts = textList;
    this.signalGraph = new Map();
    this.nodeImageList = preloadNodeImages();
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
        case ComponentType.INPUT:
        case ComponentType.OUTPUT:
          return removeNode(this, componentId);
        case ComponentType.SLOT:
          return removeSlot(this, componentId);
        case ComponentType.LINE:
          return removeConnection(this, componentId);
        case ComponentType.TEXT:
          return removeText(this, componentId);
        default:
          return false;
      }
    } else {
      const component =
        this.connections.get(componentId) ??
        this.nodes.get(componentId) ??
        this.slots.get(componentId) ??
        this.texts.get(componentId);
      if (component !== undefined)
        return this.removeComponent(component.id, component.componentType);
      else return false;
    }
  }
}
export default EditorEnvironment;
