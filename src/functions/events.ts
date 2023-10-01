import Editor from '../Editor';
import Vector2 from '../types/Vector2';
import connectionEvents from './Connection/connectionEvents';
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

  mouseClick() {
    if (this.mouseClicked && this.mouseChangedState) {
      // Obtêm uma lista com todas as colisões encontradas
      const nodeId = nodeEvents.checkNodeClick(this);
      const slotId = slotEvents.checkSlotClick(this);
      const connectionId = connectionEvents.checkConnectionClick(this);
      const textId = textEvents.checkTextClick(this);

      // Escrever aqui ou chamar outras funções que tratem o que cada tipo de colisão encontrada deve responder
      if (slotId !== undefined)
        Editor.editorEnv.getComponents().slots[slotId[0]].setState(true);
      this.clearUnselectedComponents(undefined, slotId);

      this.collisionList = {
        nodes: nodeId,
        slots: slotId,
        connections: connectionId,
        texts: textId,
      };
      this.mouseChangedState = false;
    }
  }

  mouseRelease() {
    if (!this.mouseClicked && this.mouseChangedState) {
      if (!connectionEvents.fixLine(this)) {
        this.clearDragCollisions();
      }
      this.mouseChangedState = false;
    }
  }

  mouseMove(editor: Editor) {
    if (this.mouseClicked) {
      connectionEvents.lineMove(
        this,
        this.mousePosition.minus(this.oldMousePosition)
      );
      connectionEvents.addLine(editor, this);
      nodeEvents.nodeMove(
        this,
        this.mousePosition.minus(this.oldMousePosition)
      );
      this.mouseChangedPosition = false;
      return true;
    }
    return false;
  }

  // Procura na lista anterior de colisões as que não estão presentes na atual, removendo seu estado de selecionado/ativo
  clearUnselectedComponents(
    newNodeIds?: number[],
    newSlotIds?: number[],
    newConnectionIds?: number[],
    newTextIds?: number[]
  ): void {
    if (this.collisionList.slots !== undefined) {
      this.collisionList.slots.forEach(slot => {
        if (!newSlotIds?.includes(slot)) {
          Editor.editorEnv.getComponents().slots[slot].setState(false);
        }
      });
    }
  }

  getCollisionList() {
    return this.collisionList;
  }

  clearDragCollisions() {
    this.collisionList.nodes = undefined;
  }

  clearAllCollisions() {
    this.clearUnselectedComponents();
    this.collisionList.nodes = undefined;
    this.collisionList.slots = undefined;
    this.collisionList.connections = undefined;
    this.collisionList.texts = undefined;
  }

  getMousePosition(): Vector2 {
    return this.mousePosition;
  }

  setMousePosition(position: Vector2) {
    this.oldMousePosition = this.mousePosition;
    this.mousePosition = position;
    this.mouseChangedPosition = true;
  }

  getMouseChangedState() {
    return this.mouseChangedState;
  }

  getMouseChangedPosition() {
    return this.mouseChangedPosition;
  }

  getMouseClicked() {
    return this.mouseClicked;
  }

  setMouseClicked(state = false) {
    this.mouseClicked = state;
    this.mouseChangedState = true;
  }
}
