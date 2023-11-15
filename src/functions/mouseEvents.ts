import Editor from '../Editor';
import connectionEvents from './Connection/connectionEvents';
import nodeEvents from './Node/nodeEvents';
import slotEvents from './slotEvents';
import textEvents from './textEvents';
import Mouse from '../types/Mouse';
import inputEvents from './IO/inputEvents';

export interface CollisionList {
  [index: string]: Array<number> | undefined;
  nodes: Array<number> | undefined;
  slots: Array<number> | undefined;
  connections: Array<number> | undefined;
  texts: Array<number> | undefined;
  inputs: Array<number> | undefined;
}

export default class MouseEvents {
  private collisionList: CollisionList;
  private readonly _mouse: Mouse;

  constructor(mouse: Mouse) {
    this._mouse = mouse;
    this.collisionList = {
      nodes: undefined,
      slots: undefined,
      connections: undefined,
      texts: undefined,
      inputs: undefined,
    };
  }

  onMouseClick(editor: Editor) {
    if (this._mouse.stateChanged && this._mouse.clicked) {
      // Obtêm uma lista com todas as colisões encontradas
      const nodeId = nodeEvents.checkNodeClick(this._mouse.position);
      const slotId = slotEvents.checkSlotClick(this._mouse.position);
      const connectionId = connectionEvents.checkConnectionClick(
        this._mouse.position
      );
      const textId = textEvents.checkTextClick(this._mouse.position);
      const inputId = inputEvents.checkInputClick(this._mouse.position);

      // Escrever aqui ou chamar outras funções que tratem o que cada tipo de colisão encontrada deve responder
      if (slotId !== undefined) {
        Editor.editorEnv.slots[slotId[0]].state = true;
        connectionEvents.addLine(editor, this._mouse.position);
      }
      this.clearUnselectedComponents(undefined, slotId);

      this.collisionList = {
        nodes: nodeId,
        slots: slotId,
        connections: connectionId,
        texts: textId,
        inputs: inputId,
      };
      this._mouse.stateChanged = false;
    }
  }

  onMouseRelease() {
    if (!Mouse.clicked && Mouse.stateChanged) {
      if (!connectionEvents.fixLine()) {
        this.clearDragCollisions();
      }
      this._mouse.dragged = false;
      this._mouse.stateChanged = false;
    }
  }

  onMouseMove() {
    if (!this._mouse.dragged && this._mouse.clicked) {
      const mouseMovement = this._mouse.position.sub(
        this._mouse.clickStartPosition
      );
      this._mouse.dragged =
        mouseMovement.x > this._mouse.clickToDragThreshold ||
        mouseMovement.x < -this._mouse.clickToDragThreshold ||
        mouseMovement.y > this._mouse.clickToDragThreshold ||
        mouseMovement.y < -this._mouse.clickToDragThreshold;
    }
    if (this._mouse.dragged) {
      return (
        connectionEvents.move(this._mouse.position) ||
        nodeEvents.move(this.collisionList, this._mouse.position, false) ||
        inputEvents.move(this.collisionList, this._mouse.position, false)
      );
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
          Editor.editorEnv.slots[slot].state = false;
        }
      });
    }
  }

  getCollisionList() {
    return this.collisionList;
  }

  clearDragCollisions() {
    this.collisionList.nodes = undefined;
    this.collisionList.inputs = undefined;
  }

  clearAllCollisions() {
    this.clearUnselectedComponents();
    this.collisionList.nodes = undefined;
    this.collisionList.slots = undefined;
    this.collisionList.connections = undefined;
    this.collisionList.texts = undefined;
    this.collisionList.inputs = undefined;
  }
}
