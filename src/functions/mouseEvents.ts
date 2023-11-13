import Editor from '../Editor';
import connectionEvents from './Connection/connectionEvents';
import nodeEvents from './Node/nodeEvents';
import slotEvents from './slotEvents';
import textEvents from './textEvents';
import Mouse from '../types/Mouse';
import inputEvents from './IO/inputEvents';

interface collisionListInterface {
  [index: string]: Array<number> | undefined;
  nodes: Array<number> | undefined;
  slots: Array<number> | undefined;
  connections: Array<number> | undefined;
  texts: Array<number> | undefined;
  inputs: Array<number> | undefined;
}

export default class MouseEvents {
  private collisionList: collisionListInterface;

  constructor() {
    this.collisionList = {
      nodes: undefined,
      slots: undefined,
      connections: undefined,
      texts: undefined,
      inputs: undefined,
    };
  }

  onMouseClick() {
    if (Mouse.clicked && Mouse.stateChanged) {
      // Obtêm uma lista com todas as colisões encontradas
      const nodeId = nodeEvents.checkNodeClick();
      const slotId = slotEvents.checkSlotClick();
      const connectionId = connectionEvents.checkConnectionClick();
      const textId = textEvents.checkTextClick();
      const inputId = inputEvents.checkInputClick();

      // Escrever aqui ou chamar outras funções que tratem o que cada tipo de colisão encontrada deve responder
      if (slotId !== undefined) Editor.editorEnv.slots[slotId[0]].state = true;
      this.clearUnselectedComponents(undefined, slotId);

      this.collisionList = {
        nodes: nodeId,
        slots: slotId,
        connections: connectionId,
        texts: textId,
        inputs: inputId,
      };
      Mouse.stateChanged = false;
    }
  }

  onMouseRelease() {
    if (!Mouse.clicked && Mouse.stateChanged) {
      if (!connectionEvents.fixLine()) {
        this.clearDragCollisions();
      }
      Mouse.stateChanged = false;
    }
  }

  onMouseMove(editor: Editor) {
    if (Mouse.clicked) {
      return (
        connectionEvents.move(Mouse.position) ||
        connectionEvents.addLine(editor) ||
        nodeEvents.move(this, Mouse.position, false) ||
        inputEvents.move(this, Mouse.position, false)
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
