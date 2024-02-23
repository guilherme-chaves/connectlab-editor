import Editor from '../Editor';
import connectionEvents from './Connection/connectionEvents';
import nodeEvents from './Node/nodeEvents';
import slotEvents from './slotEvents';
import textEvents from './textEvents';
import inputEvents from './IO/inputEvents';
import outputEvents from './IO/outputEvents';

import Mouse from '../types/Mouse';
import EditorEnvironment from '../EditorEnvironment';
import signalUpdate from './Signal/signalUpdate';

export interface CollisionList {
  [index: string]: Array<number> | undefined;
  nodes: Array<number> | undefined;
  slots: Array<number> | undefined;
  connections: Array<number> | undefined;
  texts: Array<number> | undefined;
  inputs: Array<number> | undefined;
  outputs: Array<number> | undefined;
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
      outputs: undefined,
    };
  }

  onMouseClick(editor: Editor) {
    // if (this._mouse.stateChanged && this._mouse.clicked) {
    // Obtêm uma lista com todas as colisões encontradas
    const nodeId = nodeEvents.checkNodeClick(
      editor.editorEnv.nodes,
      this._mouse.position
    );
    const slotId = slotEvents.checkSlotClick(
      editor.editorEnv.slots,
      this._mouse.position
    );
    const connectionId = connectionEvents.checkConnectionClick(
      editor.editorEnv.connections,
      this._mouse.position
    );
    const textId = textEvents.checkTextClick(
      editor.editorEnv.texts,
      this._mouse.position
    );
    const inputId = inputEvents.checkInputClick(
      editor.editorEnv.inputs,
      this._mouse.position
    );
    const outputId = outputEvents.checkOutputClick(
      editor.editorEnv.outputs,
      this._mouse.position
    );

    // Escrever aqui ou chamar outras funções que tratem o que cada tipo de colisão encontrada deve responder
    if (slotId !== undefined) {
      editor.editorEnv.slots.get(slotId[0])!.selected = true;
      connectionEvents.addLine(editor, this._mouse.position);
    }
    this.clearUnselectedComponents(editor.editorEnv, undefined, slotId);

    this.collisionList = {
      nodes: nodeId,
      slots: slotId,
      connections: connectionId,
      texts: textId,
      inputs: inputId,
      outputs: outputId,
    };
    this._mouse.stateChanged = false;
    // }
  }

  onMouseRelease(editorEnv: EditorEnvironment) {
    if (!this._mouse.clicked && this._mouse.stateChanged) {
      if (!this._mouse.dragged) {
        if (this.collisionList.inputs !== undefined) {
          inputEvents.switchInputState(
            editorEnv.inputs,
            this.collisionList.inputs[0]
          );
          signalUpdate.updateGraphPartial(
            editorEnv,
            this.collisionList.inputs[0]
          );
        }
      }
      if (!connectionEvents.fixLine(editorEnv, this._mouse.position)) {
        this.clearDragCollisions();
      }
      this._mouse.stateChanged = false;
    }
  }

  onMouseMove(editorEnv: EditorEnvironment) {
    if (this._mouse.dragged) {
      return (
        connectionEvents.move(editorEnv, this._mouse.position) ||
        nodeEvents.move(
          editorEnv.nodes,
          this.collisionList,
          this._mouse.position,
          false
        ) ||
        inputEvents.move(
          editorEnv.inputs,
          this.collisionList,
          this._mouse.position,
          false
        ) ||
        outputEvents.move(
          editorEnv.outputs,
          this.collisionList,
          this._mouse.position,
          false
        )
      );
    }
    return false;
  }

  // Procura na lista anterior de colisões as que não estão presentes na atual, removendo seu estado de selecionado/ativo
  clearUnselectedComponents(
    editorEnv: EditorEnvironment,
    newNodeIds: Array<number> = [],
    newSlotIds: Array<number> = [],
    newConnectionIds: Array<number> = [],
    newTextIds: Array<number> = [],
    newInputIds: Array<number> = [],
    newOutputIds: Array<number> = []
  ): void {
    if (this.collisionList.nodes !== undefined) {
      this.collisionList.nodes.forEach(node => {
        if (newNodeIds.includes(node)) {
          editorEnv.nodes.get(node)!.selected = false;
        }
      });
    }
    if (this.collisionList.slots !== undefined) {
      this.collisionList.slots.forEach(slot => {
        if (newSlotIds.includes(slot)) {
          editorEnv.slots.get(slot)!.selected = false;
        }
      });
    }
    if (this.collisionList.connections !== undefined) {
      this.collisionList.connections.forEach(connection => {
        if (newConnectionIds.includes(connection)) {
          editorEnv.connections.get(connection)!.selected = false;
        }
      });
    }
    if (this.collisionList.texts !== undefined) {
      this.collisionList.texts.forEach(text => {
        if (newTextIds.includes(text)) {
          editorEnv.texts.get(text)!.selected = false;
        }
      });
    }
    if (this.collisionList.inputs !== undefined) {
      this.collisionList.inputs.forEach(input => {
        if (newInputIds.includes(input)) {
          editorEnv.inputs.get(input)!.selected = false;
        }
      });
    }
    if (this.collisionList.outputs !== undefined) {
      this.collisionList.outputs.forEach(output => {
        if (newOutputIds.includes(output)) {
          editorEnv.outputs.get(output)!.selected = false;
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

  clearAllCollisions(editorEnv: EditorEnvironment) {
    this.clearUnselectedComponents(editorEnv);
    this.collisionList.nodes = undefined;
    this.collisionList.slots = undefined;
    this.collisionList.connections = undefined;
    this.collisionList.texts = undefined;
    this.collisionList.inputs = undefined;
  }
}
