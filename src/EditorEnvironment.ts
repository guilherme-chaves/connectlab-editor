import {
  ComponentType,
  ImageListObject,
  FullComponentList,
  NodeList,
  ConnectionList,
  SlotList,
  TextList,
  SignalGraph,
  SignalGraphData,
} from '@connectlab-editor/types';
import {
  removeNode,
  removeSlot,
  removeConnection,
  removeText,
} from '@connectlab-editor/functions/removeComponent';
import ConnectionComponent, {
  ConnectionObject,
} from '@connectlab-editor/components/ConnectionComponent';
import NodeComponent, {
  NodeObject,
} from '@connectlab-editor/components/NodeComponent';
import {addComponent} from '@connectlab-editor/functions/addComponent';
import SlotComponent, {
  SlotObject,
} from '@connectlab-editor/components/SlotComponent';
import TextComponent, {
  TextObject,
} from '@connectlab-editor/components/TextComponent';
import Vector2 from '@connectlab-editor/types/Vector2';

export type EditorEnvironmentObject = {
  id: string;
  data: {
    nodes: NodeObject[];
    connections: ConnectionObject[];
    slots: SlotObject[];
    texts: TextObject[];
  };
  signal: Record<number, SignalGraphData>;
};

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
    imageList: ImageListObject,
    signalGraph: SignalGraph = {},
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
    this.signalGraph = signalGraph;
    this.nodeImageList = imageList;
  }

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

  updateComponentId(next?: number): number {
    const ret = this._nextComponentId;
    this._nextComponentId = next
      ? Math.max(this._nextComponentId + 1, next + 1)
      : this._nextComponentId + 1;
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

  saveAsJson(): string {
    const env: EditorEnvironmentObject = {
      id: this.documentId,
      data: {
        nodes: [],
        connections: [],
        slots: [],
        texts: [],
      },
      signal: {},
    };
    for (const [key, map] of Object.entries(this.components)) {
      for (const component of map.values()) {
        switch (key) {
          case 'nodes':
            env.data.nodes.push((component as NodeComponent).toObject());
            break;
          case 'slots':
            env.data.slots.push((component as SlotComponent).toObject());
            break;
          case 'connections':
            env.data.connections.push(
              (component as ConnectionComponent).toObject()
            );
            break;
          case 'texts':
            env.data.texts.push((component as TextComponent).toObject());
            break;
        }
      }
    }
    env.signal = this.signalGraph;
    return JSON.stringify(env);
  }

  static createFromJson(
    data: EditorEnvironmentObject,
    ctx: CanvasRenderingContext2D,
    imageList: ImageListObject
  ): EditorEnvironment {
    const newEnv = new EditorEnvironment(
      data.id,
      undefined,
      structuredClone(imageList),
      data.signal
    );
    for (const nodeObj of data.data.nodes) {
      addComponent.node(
        nodeObj.id,
        newEnv,
        ctx.canvas.width,
        ctx.canvas.height,
        nodeObj.nodeType,
        nodeObj.position.x,
        nodeObj.position.y,
        nodeObj.componentType,
        nodeObj.slotIds,
        false
      );
    }
    for (const slotObj of data.data.slots) {
      addComponent.slot(
        slotObj.id,
        newEnv,
        slotObj.position.x,
        slotObj.position.y,
        newEnv.nodes.get(slotObj.parentId)!,
        slotObj.inSlot,
        slotObj.radius,
        slotObj.attractionRadius,
        slotObj.color,
        slotObj.colorActive
      );
    }
    for (const lineObj of data.data.connections) {
      addComponent.connection(
        lineObj.id,
        newEnv,
        lineObj.position.x,
        lineObj.position.y,
        lineObj.endPosition.x,
        lineObj.endPosition.y,
        lineObj.connectedTo.start,
        lineObj.connectedTo.end,
        lineObj.anchors.map(vo => new Vector2(vo.x, vo.y, vo.useInt))
      );
      if (lineObj.connectedTo.start)
        newEnv.slots
          .get(lineObj.connectedTo.start.slotId)!
          .slotConnections.push(newEnv.connections.get(lineObj.id)!);
      if (lineObj.connectedTo.end)
        newEnv.slots
          .get(lineObj.connectedTo.end.slotId)!
          .slotConnections.push(newEnv.connections.get(lineObj.id)!);
    }
    for (const textObj of data.data.texts) {
      addComponent.text(
        textObj.id,
        newEnv,
        ctx,
        textObj.text,
        textObj.position.x,
        textObj.position.y,
        textObj.style
      );
      break;
    }
    return newEnv;
  }
}
export default EditorEnvironment;
