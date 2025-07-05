import {NodeList, SignalGraph} from '@connectlab-editor/types/common';
import Vector2i from '@connectlab-editor/types/vector2i';
import MouseEvents from '@connectlab-editor/events/mouseEvents';
import NodeInterface from '@connectlab-editor/interfaces/nodeInterface';
import {componentEvents} from '@connectlab-editor/events/componentEvents';
import EditorEnvironment from '@connectlab-editor/environment';
import {EditorEvents, NodeTypes} from '@connectlab-editor/types/enums';
import signalUpdate from '@connectlab-editor/signal/signalUpdate';

export default {
  // Busca na lista de nodes quais possuem uma colisão com o ponto do mouse
  checkNodeClick(nodes: NodeList, position: Vector2i): number[] {
    return componentEvents.checkComponentClick(position, nodes);
  },
  move(
    editorEnv: EditorEnvironment,
    mouseEvents: MouseEvents,
    v: Vector2i,
    useDelta = true
  ): boolean {
    const nodeCollisions = mouseEvents.getCollisionList().nodes;
    if (
      nodeCollisions.length === 0 ||
      !(
        MouseEvents.movingObject === 'none' ||
        MouseEvents.movingObject === 'node'
      )
    )
      return false;

    MouseEvents.movingObject = 'node';
    const node = editorEnv.nodes.get(nodeCollisions[0]);
    if (node === undefined) return false;
    node.move(v, useDelta);
    this.moveLinkedElements(node, editorEnv.nodes);
    return true;
  },
  moveLinkedElements(node: NodeInterface, nodeList: NodeList): void {
    for (const slot of node.slots) {
      if (!slot) continue;
      slot.move();
      for (let i = 0; i < slot.slotConnections.length; i++) {
        const connection = slot.slotConnections[i];
        if (connection.connectedTo.start?.slotId === slot.id)
          connection.move(slot.globalPosition, false, 0, true, nodeList);
        else if (connection.connectedTo.end?.slotId === slot.id)
          connection.move(slot.globalPosition, false, 1, true, nodeList);
      }
    }
  },
  onPhysicsEngineUpdate(nodes: NodeList, signalGraph: SignalGraph): void {
    const updateList: Array<number> = [];
    for (const node of nodes.values()) {
      if (
        node.nodeType.id === NodeTypes.I_CLOCK &&
        node.onEvent(EditorEvents.PHYSICS_ENGINE_CYCLE)
      )
        updateList.push(node.id);
    }
    for (const id of updateList) {
      signalUpdate.updateGraph(signalGraph, id);
    }
  },
};
