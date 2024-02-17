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
    if (editor.editorEnv.editorRenderer === undefined) return;
    if (this._mouse.stateChanged && this._mouse.clicked) {
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
      if (slotId.length > 0) {
        editor.editorEnv.editorRenderer!.renderGraph.get(
          slotId[0]
        )!.object!.selected = true;
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
    }
  }

  onMouseRelease(editorEnv: EditorEnvironment): void {
    if (editorEnv.editorRenderer === undefined) return;
    if (!this._mouse.clicked && this._mouse.stateChanged) {
      if (!this._mouse.dragged) {
        if (this.collisionList.inputs.length > 0) {
          inputEvents.switchInputState(editorEnv, this.collisionList.inputs[0]);
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

  onMouseMove(editorEnv: EditorEnvironment): boolean {
    if (editorEnv.editorRenderer === undefined) return false;
    if (this._mouse.clicked && this._mouse.dragged) {
      if (this.collisionList.nodes.length > 0) {
        return nodeEvents.move(
          this.collisionList!.nodes[0],
          editorEnv.editorRenderer!.renderGraph,
          editorEnv.nodes,
          this.collisionList,
          this,
          this._mouse.position,
          false
        );
      } else if (this.collisionList.inputs.length > 0) {
        return inputEvents.move(
          this.collisionList!.inputs[0],
          editorEnv.editorRenderer!.renderGraph,
          editorEnv.inputs,
          this.collisionList,
          this,
          this._mouse.position,
          false
        );
      } else if (this.collisionList.outputs.length > 0) {
        return outputEvents.move(
          this.collisionList!.outputs[0] ?? -1,
          editorEnv.editorRenderer!.renderGraph,
          editorEnv.outputs,
          this.collisionList,
          this,
          this._mouse.position,
          false
        );
      } else {
        return connectionEvents.move(editorEnv, this, this._mouse.position);
      }
    }
    this.movingObject = 'none';
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
    if (this.collisionList.nodes.length > 0) {
      this.collisionList.nodes.forEach(node => {
        if (newNodeIds.includes(node)) {
          editorEnv.editorRenderer!.renderGraph.get(node)!.object!.selected =
            false;
        }
      });
    }
    if (this.collisionList.slots.length > 0) {
      this.collisionList.slots.forEach(slot => {
        if (newSlotIds.includes(slot)) {
          editorEnv.editorRenderer!.renderGraph.get(slot)!.object!.selected =
            false;
        }
      });
    }
    if (this.collisionList.connections.length > 0) {
      this.collisionList.connections.forEach(connection => {
        if (newConnectionIds.includes(connection)) {
          editorEnv.editorRenderer!.renderGraph.get(
            connection
          )!.line!.selected = false;
        }
      });
    }
    if (this.collisionList.texts.length > 0) {
      this.collisionList.texts.forEach(text => {
        if (newTextIds.includes(text)) {
          editorEnv.editorRenderer!.renderGraph.get(text)!.object!.selected =
            false;
        }
      });
    }
    if (this.collisionList.inputs.length > 0) {
      this.collisionList.inputs.forEach(input => {
        if (newInputIds.includes(input)) {
          editorEnv.editorRenderer!.renderGraph.get(input)!.object!.selected =
            false;
        }
      });
    }
    if (this.collisionList.outputs.length > 0) {
      this.collisionList.outputs.forEach(output => {
        if (newOutputIds.includes(output)) {
          editorEnv.editorRenderer!.renderGraph.get(output)!.object!.selected =
            false;
        }
      });
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
