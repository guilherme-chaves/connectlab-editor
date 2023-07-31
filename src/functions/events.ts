import Editor from '../Editor';
import Vector2 from '../types/Vector2';
import ComponentsList from '../components/ComponentsList';
import connectionEvents from './connectionEvents';
import nodeEvents from './nodeEvents';
import slotEvents from './slotEvents';
import textEvents from './textEvents';

interface collisionListInterface {
  [index: string]: Array<number> | undefined;
  nodes: Array<number> | undefined;
  slots: Array<number> | undefined;
  connections: Array<number> | undefined;
  texts: Array<number> | undefined;
}

export default class EditorEvents {
  // private currentComponentType: ComponentType
  // private currentNodeType: nodeTypes

  private collisionList: collisionListInterface;

  private mousePosition: Vector2; // Posição dentro do canvas, não global
  private oldMousePosition: Vector2;
  private mouseClicked: boolean;
  private mouseChangedState: boolean;
  private mouseChangedPosition: boolean;

  constructor() {
    // this.currentComponentType = ComponentType.NODE
    // this.currentNodeType = nodeTypes.NOT

    this.collisionList = {
      nodes: undefined,
      slots: undefined,
      connections: undefined,
      texts: undefined,
    };

    this.mousePosition = new Vector2(0, 0);
    this.oldMousePosition = this.mousePosition;
    this.mouseClicked = false;
    this.mouseChangedState = true;
    this.mouseChangedPosition = false;
  }

  mouseClick(componentsList: ComponentsList) {
    if (this.mouseClicked && this.mouseChangedState) {
      // Obtêm uma lista com todas as colisões encontradas
      const nodeId = nodeEvents.checkNodeClick(componentsList, this);
      const slotId = slotEvents.checkSlotClick(componentsList, this);
      const connectionId = connectionEvents.checkConnectionClick(componentsList, this);
      const textId = textEvents.checkTextClick(componentsList, this);
      
      // Escrever aqui ou chamar outras funções que tratem o que cada tipo de colisão encontrada deve responder
      if (slotId != undefined)
        componentsList.getComponents().slots[slotId[0]].setState(true);
      this.clearUnselectedComponents(componentsList, undefined, slotId);
      
      this.collisionList = {
        nodes: nodeId,
        slots: slotId,
        connections: connectionId,
        texts: textId
      }
      this.mouseChangedState = false;
    }
  }

  mouseRelease(componentsList: ComponentsList) {
    if (!this.mouseClicked && this.mouseChangedState) {
      if (!connectionEvents.fixLine(componentsList, this)) {
        this.clearDragCollisions()
      }
      this.mouseChangedState = false;
    }
  }

  mouseMove(editor: Editor, componentsList: ComponentsList) {
    if (this.mouseClicked) {
      connectionEvents.lineMove(
        componentsList,
        this,
        this.mousePosition.minus(this.oldMousePosition)
      )
      connectionEvents.addLine(editor, this)
      nodeEvents.nodeMove(
        componentsList,
        this,
        this.mousePosition.minus(this.oldMousePosition)
      )
      this.mouseChangedPosition = false;
      return true;
    }
    return false;
  }

  // Procura na lista anterior de colisões as que não estão presentes na atual, removendo seu estado de selecionado/ativo
  clearUnselectedComponents = (
    componentsList: ComponentsList,
    newNodeIds?: number[],
    newSlotIds?: number[],
    newConnectionIds?: number[],
    newTextIds?: number[]
  ): void => {
    if (this.collisionList.slots != undefined) {
      this.collisionList.slots.forEach(slot => {
        if (!newSlotIds?.includes(slot)) {
          componentsList.getComponents().slots[slot].setState(false);
        }
      });
    }
  };

  getCollisionList() {
    return this.collisionList;
  }

  clearDragCollisions = () => {
    this.collisionList.nodes = undefined;
  };

  clearAllCollisions(componentsList: ComponentsList) {
    this.clearUnselectedComponents(componentsList);
    this.collisionList.nodes = undefined;
    this.collisionList.slots = undefined;
    this.collisionList.connections = undefined;
    this.collisionList.texts = undefined;
  };

  getMousePosition(): Vector2 {
    return this.mousePosition;
  }

  setMousePosition(position: Vector2) {
    this.oldMousePosition = this.mousePosition;
    this.mousePosition = position;
    this.mouseChangedPosition = true;
  }

  getMouseChangedState = () => {
    return this.mouseChangedState
  }

  getMouseChangedPosition = () => {
    return this.mouseChangedPosition
  }

  getMouseClicked = () => {
    return this.mouseClicked
  }

  setMouseClicked(state = false) {
    this.mouseClicked = state;
    this.mouseChangedState = true;
  }
}
