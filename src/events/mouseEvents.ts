/* eslint-disable no-case-declarations */
import {connectionEvents} from '@connectlab-editor/events/connectionEvents';
import nodeEvents from '@connectlab-editor/events/nodeEvents';
import slotEvents from '@connectlab-editor/events/slotEvents';
import textEvents from '@connectlab-editor/events/textEvents';

import Mouse from '@connectlab-editor/types/mouse';
import EditorEnvironment from '@connectlab-editor/environment';
import signalUpdate from '@connectlab-editor/signal/signalUpdate';

interface CollisionList {
  [index: string]: Array<number>;
  nodes: Array<number>;
  slots: Array<number>;
  connections: Array<number>;
  texts: Array<number>;
}

export default class MouseEvents {
  private collisionList: CollisionList;
  private readonly _mouse: Mouse;
  public movingObject: 'node' | 'connection' | 'text' | 'none';

  constructor(mouse: Mouse) {
    this._mouse = mouse;
    this.collisionList = {
      nodes: [],
      slots: [],
      connections: [],
      texts: [],
    };
    this.movingObject = 'none';
  }

  onMouseClick(editorEnv: EditorEnvironment): void {
    if (this._mouse.stateChanged && this._mouse.clicked) {
      this.clearAllCollisions(editorEnv);
      // Obtêm uma lista com todas as colisões encontradas
      const nodes = nodeEvents.checkNodeClick(
        editorEnv.nodes,
        this._mouse.position
      );
      const slots = slotEvents.checkSlotClick(
        editorEnv.slots,
        this._mouse.position
      );
      const connections = connectionEvents.checkConnectionClick(
        editorEnv.connections,
        this._mouse.position
      );
      const texts = textEvents.checkTextClick(
        editorEnv.texts,
        this._mouse.position
      );

      this.clearUnselectedComponents(
        editorEnv,
        nodes,
        slots,
        connections,
        texts
      );

      this.collisionList = {
        nodes,
        slots,
        connections,
        texts,
      };

      // Escrever aqui ou chamar outras funções que tratem o que cada tipo de colisão encontrada deve responder
      connectionEvents.addLine(editorEnv, this);

      this.showSelectedComponents(editorEnv);

      this._mouse.stateChanged = false;
    }
  }

  onMouseRelease(editorEnv: EditorEnvironment): void {
    if (!this._mouse.clicked && this._mouse.stateChanged) {
      if (!this._mouse.dragged) {
        if (this.collisionList.nodes.length !== 0) {
          if (
            nodeEvents.switchInputState(
              editorEnv.nodes,
              this.collisionList.nodes[0]
            )
          )
            signalUpdate.updateGraph(
              editorEnv.signalGraph,
              this.collisionList.nodes[0]
            );
        }
      }
      connectionEvents.fixLine(editorEnv, this._mouse.position);
      this._mouse.stateChanged = false;
    }
    this.movingObject = 'none';
  }

  onMouseMove(editorEnv: EditorEnvironment): boolean {
    if (this._mouse.clicked && this._mouse.dragged) {
      return (
        connectionEvents.move(editorEnv, this, this._mouse.position) ||
        nodeEvents.move(editorEnv, this, this._mouse.position, false) ||
        textEvents.move(editorEnv.texts, this, this._mouse.position, false)
      );
    }
    return false;
  }

  showSelectedComponents(editorEnv: EditorEnvironment): void {
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
    newTextIds: Array<number> = []
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
  }

  getCollisionList(): CollisionList {
    return this.collisionList;
  }

  clearAllCollisions(editorEnv: EditorEnvironment): void {
    this.clearUnselectedComponents(editorEnv);
    this.collisionList.nodes = [];
    this.collisionList.slots = [];
    this.collisionList.connections = [];
    this.collisionList.texts = [];
  }
}
