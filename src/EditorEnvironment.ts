import ComponentType, {
  componentListInterface,
  connectionListInterface,
  nodeListInterface,
  slotListInterface,
  textListInterface,
} from './types/types';
import ConnectionComponent from './components/ConnectionComponent';
import NodeComponent from './components/NodeComponent';
import SlotComponent from './components/SlotComponent';
import TextComponent from './components/TextComponent';

class EditorEnvironment {
  public documentId: string;
  private lastComponentId: number;
  private nodeList: nodeListInterface;
  private slotList: slotListInterface;
  private connectionList: connectionListInterface;
  private textList: textListInterface;
  constructor(
    documentId: string,
    lastComponentId = 0,
    nodeList = {},
    slotList = {},
    connectionList = {},
    textList = {}
  ) {
    this.documentId = documentId;
    this.lastComponentId = lastComponentId;
    this.nodeList = nodeList;
    this.slotList = slotList;
    this.connectionList = connectionList;
    this.textList = textList;
  }

  /* Getters e Setters */

  getDocumentId(): string {
    return this.documentId;
  }

  getComponents(): componentListInterface {
    return {
      nodes: this.nodeList,
      slots: this.slotList,
      connections: this.connectionList,
      texts: this.textList,
    };
  }

  getLastComponentId(): number {
    return this.lastComponentId;
  }

  setLastComponentId(id: number): void {
    this.lastComponentId = id;
  }

  addComponent(
    component:
      | NodeComponent
      | SlotComponent
      | ConnectionComponent
      | TextComponent
  ) {
    switch (component.type) {
      case ComponentType.NODE:
        this.nodeList[this.lastComponentId] = component as NodeComponent;
        break;
      case ComponentType.SLOT:
        this.slotList[this.lastComponentId] = component as SlotComponent;
        break;
      case ComponentType.LINE:
        this.connectionList[this.lastComponentId] =
          component as ConnectionComponent;
        break;
      case ComponentType.TEXT:
        this.textList[this.lastComponentId] = component as TextComponent;
        break;
    }
    this.lastComponentId += 1;
    return this.lastComponentId - 1;
  }

  removeComponent(
    componentId: number = this.lastComponentId,
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
    }
  }
}
export default EditorEnvironment;
