import ComponentType, {
  FullComponentList,
  NodeList,
  ConnectionList,
  SlotList,
  TextList,
  InputList,
  OutputList,
  SignalGraph,
  RenderObjectType,
} from './types/types';
import ConnectionComponent from './components/ConnectionComponent';
import NodeComponent from './components/NodeComponent';
import SlotComponent from './components/SlotComponent';
import TextComponent from './components/TextComponent';
import Component from './interfaces/componentInterface';
import InputComponent from './components/InputComponent';
import OutputComponent from './components/OutputComponent';
import signalEvents from './functions/Signal/signalEvents';
import Renderer from './interfaces/renderer';

class EditorEnvironment {
  public documentId: string;
  private _nextComponentId: number;
  public readonly nodes: NodeList;
  public readonly slots: SlotList;
  public readonly connections: ConnectionList;
  public readonly texts: TextList;
  public readonly inputs: InputList;
  public readonly outputs: OutputList;
  public readonly signalGraph: SignalGraph;
  public readonly editorRenderer: Renderer | undefined;

  constructor(
    documentId: string,
    signalGraph: SignalGraph,
    renderer: Renderer | undefined,
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
    this.signalGraph = signalGraph;
    this.editorRenderer = renderer;
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

  addComponent(component: Component): number {
    switch (component.componentType) {
      case ComponentType.NODE:
        this.nodes.set(this._nextComponentId, component as NodeComponent);
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
        this.slots.set(this._nextComponentId, component as SlotComponent);
        break;
      case ComponentType.LINE:
        this.connections.set(
          this._nextComponentId,
          component as ConnectionComponent
        );
        break;
      case ComponentType.TEXT:
        this.texts.set(this._nextComponentId, component as TextComponent);
        break;
      case ComponentType.INPUT:
        this.inputs.set(this._nextComponentId, component as InputComponent);
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
        this.outputs.set(this._nextComponentId, component as OutputComponent);
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
          return this.nodes.delete(componentId);
        case ComponentType.SLOT:
          return this.slots.delete(componentId);
        case ComponentType.LINE:
          signalEvents.removeEdge(this, this.connections.get(componentId));
          this.connections.get(componentId)!.collisionShape.length = 0;
          this.connections.delete(componentId);
          this.editorRenderer?.removeObject(componentId, RenderObjectType.LINE);
          return true;
        case ComponentType.TEXT:
          return this.texts.delete(componentId);
        case ComponentType.INPUT:
          signalEvents.removeVertex(this, componentId);
          return this.inputs.delete(componentId);
        case ComponentType.OUTPUT:
          signalEvents.removeVertex(this, componentId);
          return this.outputs.delete(componentId);
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
