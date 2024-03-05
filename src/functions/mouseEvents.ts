/* eslint-disable no-case-declarations */
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
  [index: string]: Array<number>;
  nodes: Array<number>;
  slots: Array<number>;
  connections: Array<number>;
  texts: Array<number>;
  inputs: Array<number>;
  outputs: Array<number>;
}

export default class MouseEvents {
  private collisionList: CollisionList;
  private readonly _mouse: Mouse;
  public movingObject:
    | 'input'
    | 'node'
    | 'output'
    | 'connection'
    | 'text'
    | 'none';

  constructor(mouse: Mouse) {
    this._mouse = mouse;
    this.collisionList = {
      nodes: [],
      slots: [],
      connections: [],
      texts: [],
      inputs: [],
      outputs: [],
    };
    this.movingObject = 'none';
  }

  onMouseClick(editor: Editor) {
    if (this._mouse.stateChanged && this._mouse.clicked) {
      this.clearAllCollisions(editor.editorEnv);
      // Obtêm uma lista com todas as colisões encontradas
      const nodes = nodeEvents.checkNodeClick(
        editor.editorEnv.nodes,
        this._mouse.position
      );
      const slots = slotEvents.checkSlotClick(
        editor.editorEnv.slots,
        this._mouse.position
      );
      const connections = connectionEvents.checkConnectionClick(
        editor.editorEnv.connections,
        this._mouse.position
      );
      const texts = textEvents.checkTextClick(
        editor.editorEnv.texts,
        this._mouse.position
      );
      const inputs = inputEvents.checkInputClick(
        editor.editorEnv.inputs,
        this._mouse.position
      );
      const outputs = outputEvents.checkOutputClick(
        editor.editorEnv.outputs,
        this._mouse.position
      );

      this.clearUnselectedComponents(
        editor.editorEnv,
        nodes,
        slots,
        connections,
        texts,
        inputs,
        outputs
      );

      this.collisionList = {
        nodes,
        slots,
        connections,
        texts,
        inputs,
        outputs,
      };

      // Escrever aqui ou chamar outras funções que tratem o que cada tipo de colisão encontrada deve responder
      if (slots.length !== 0) {
        connectionEvents.addLine(editor, this);
      }

      this.showSelectedComponents(editor.editorEnv);

      this._mouse.stateChanged = false;
    }
  }

  onMouseRelease(editorEnv: EditorEnvironment) {
    if (!this._mouse.clicked && this._mouse.stateChanged) {
      if (!this._mouse.dragged) {
        if (this.collisionList.inputs.length !== 0) {
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
      connectionEvents.fixLine(editorEnv, this._mouse.position);
      this._mouse.stateChanged = false;
    }
    this.movingObject = 'none';
  }

  onMouseMove(editorEnv: EditorEnvironment) {
    if (this._mouse.clicked && this._mouse.dragged) {
      return (
        connectionEvents.move(editorEnv, this, this._mouse.position) ||
        nodeEvents.move(editorEnv.nodes, this, this._mouse.position, false) ||
        inputEvents.move(editorEnv.inputs, this, this._mouse.position, false) ||
        outputEvents.move(editorEnv.outputs, this, this._mouse.position, false)
      );
    }
    return false;
  }

  showSelectedComponents(editorEnv: EditorEnvironment) {
    for (const [key, category] of Object.entries(this.collisionList)) {
      switch (key) {
        case 'slots':
          const slot = editorEnv.slots.get(category[0]);
          if (slot) slot.selected = true;
          break;
        case 'nodes':
          const nodes = editorEnv.nodes.get(category[0]);
          if (nodes) nodes.selected = true;
          break;
        case 'inputs':
          const inputs = editorEnv.inputs.get(category[0]);
          if (inputs) inputs.selected = true;
          break;
        case 'outputs':
          const outputs = editorEnv.outputs.get(category[0]);
          if (outputs) outputs.selected = true;
          break;
        case 'texts':
          const text = editorEnv.texts.get(category[0]);
          if (text) text.selected = true;
          break;
        case 'connections':
          const connections = editorEnv.connections.get(category[0]);
          if (connections) connections.selected = true;
          break;
      }
    }
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
    if (this.collisionList.nodes.length !== 0) {
      for (let i = 0; i < this.collisionList.nodes.length; i++)
        if (!newNodeIds.includes(this.collisionList.nodes[i])) {
          const node = editorEnv.nodes.get(this.collisionList.nodes[i]);
          if (node) node.selected = false;
        }
    }
    if (this.collisionList.slots.length !== 0) {
      for (let i = 0; i < this.collisionList.slots.length; i++)
        if (!newSlotIds.includes(this.collisionList.slots[i])) {
          const slot = editorEnv.slots.get(this.collisionList.slots[i]);
          if (slot) slot.selected = false;
        }
    }
    if (this.collisionList.connections.length !== 0) {
      for (let i = 0; i < this.collisionList.connections.length; i++)
        if (!newConnectionIds.includes(this.collisionList.connections[i])) {
          const connection = editorEnv.connections.get(
            this.collisionList.connections[i]
          );
          if (connection) connection.selected = false;
        }
    }
    if (this.collisionList.texts.length !== 0) {
      for (let i = 0; i < this.collisionList.texts.length; i++)
        if (!newTextIds.includes(this.collisionList.texts[i])) {
          const text = editorEnv.texts.get(this.collisionList.texts[i]);
          if (text) text.selected = false;
        }
    }
    if (this.collisionList.inputs.length !== 0) {
      for (let i = 0; i < this.collisionList.inputs.length; i++)
        if (!newInputIds.includes(this.collisionList.inputs[i])) {
          const input = editorEnv.inputs.get(this.collisionList.inputs[i]);
          if (input) input.selected = false;
        }
    }
    if (this.collisionList.outputs.length !== 0) {
      for (let i = 0; i < this.collisionList.outputs.length; i++)
        if (!newOutputIds.includes(this.collisionList.outputs[i])) {
          const output = editorEnv.outputs.get(this.collisionList.outputs[i]);
          if (output) output.selected = false;
        }
    }
  }

  getCollisionList() {
    return this.collisionList;
  }

  clearDragCollisions() {
    this.collisionList.nodes = [];
    this.collisionList.inputs = [];
  }

  clearAllCollisions(editorEnv: EditorEnvironment) {
    this.clearUnselectedComponents(editorEnv);
    this.collisionList.nodes = [];
    this.collisionList.slots = [];
    this.collisionList.connections = [];
    this.collisionList.texts = [];
    this.collisionList.inputs = [];
  }
}
