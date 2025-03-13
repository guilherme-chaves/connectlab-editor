import {connectionEvents} from '@connectlab-editor/events/connectionEvents';
import nodeEvents from '@connectlab-editor/events/nodeEvents';
import slotEvents from '@connectlab-editor/events/slotEvents';
import textEvents from '@connectlab-editor/events/textEvents';

import Mouse from '@connectlab-editor/types/mouse';
import EditorEnvironment from '@connectlab-editor/environment';
import signalUpdate from '@connectlab-editor/signal/signalUpdate';
import {
  ComponentType,
  EditorEvents,
  NodeTypes,
} from '@connectlab-editor/types/enums';

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

      this.collisionList = {
        nodes,
        slots,
        connections,
        texts,
      };

      // Escrever aqui ou chamar outras funções que tratem o que cada tipo de colisão encontrada deve responder
      connectionEvents.addLine(editorEnv, this);
      const node = editorEnv.nodes.get(this.collisionList.nodes[0]);
      if (node !== undefined && node.nodeType.id === NodeTypes.I_BUTTON) {
        node.onEvent(EditorEvents.MOUSE_CLICKED);
        signalUpdate.updateGraph(
          editorEnv.signalGraph,
          this.collisionList.nodes[0]
        );
      }

      this.displaySelectedComponents(editorEnv);

      this._mouse.stateChanged = false;
    }
  }

  onMouseRelease(editorEnv: EditorEnvironment): void {
    if (!this._mouse.clicked && this._mouse.stateChanged) {
      if (!this._mouse.dragged) {
        if (this.collisionList.nodes.length !== 0) {
          const node = editorEnv.nodes.get(this.collisionList.nodes[0]);
          if (
            node !== undefined &&
            node.componentType === ComponentType.INPUT &&
            node.onEvent(EditorEvents.MOUSE_RELEASED)
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

  private displaySelectedComponents(editorEnv: EditorEnvironment): void {
    for (const [category, collisions] of Object.entries(this.collisionList)) {
      editorEnv.components[category]
        .get(collisions[0])
        ?.onEvent(EditorEvents.FOCUS_IN);
    }
  }

  private clearSelectedComponents(editorEnv: EditorEnvironment): void {
    for (const [category, collisions] of Object.entries(this.collisionList)) {
      for (const collision of collisions) {
        editorEnv.components[category]
          .get(collision)
          ?.onEvent(EditorEvents.FOCUS_OUT);
      }
    }
  }

  getCollisionList(): CollisionList {
    return this.collisionList;
  }

  clearAllCollisions(editorEnv: EditorEnvironment): void {
    this.clearSelectedComponents(editorEnv);
    this.collisionList.nodes = [];
    this.collisionList.slots = [];
    this.collisionList.connections = [];
    this.collisionList.texts = [];
  }
}
