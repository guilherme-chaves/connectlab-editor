import {ComponentType, NodeList} from '@connectlab-editor/types';
import Vector2 from '@connectlab-editor/types/vector2';
import MouseEvents from '@connectlab-editor/events/mouseEvents';
import NodeComponent from '@connectlab-editor/components/nodeComponent';
import {componentEvents} from '@connectlab-editor/events/componentEvents';
import EditorEnvironment from '@connectlab-editor/environment';

export default {
  // Busca na lista de nodes quais possuem uma colisão com o ponto do mouse
  checkNodeClick(nodes: NodeList, position: Vector2): number[] {
    return componentEvents.checkComponentClick(position, nodes);
  },
  move(
    editorEnv: EditorEnvironment,
    mouseEvents: MouseEvents,
    v: Vector2,
    useDelta = true
  ): boolean {
    const nodeCollisions = mouseEvents.getCollisionList().nodes;
    if (
      nodeCollisions.length === 0 ||
      !(
        mouseEvents.movingObject === 'none' ||
        mouseEvents.movingObject === 'node'
      )
    )
      return false;

    mouseEvents.movingObject = 'node';
    const node = editorEnv.nodes.get(nodeCollisions[0]);
    if (node === undefined) return false;
    node.move(v, useDelta);
    this.moveLinkedElements(node, useDelta);
    return true;
  },
  moveLinkedElements(node: NodeComponent, useDelta = true): void {
    for (const slot of node.slots) {
      if (!slot) continue;
      slot.move();
      for (let i = 0; i < slot.slotConnections.length; i++) {
        const connection = slot.slotConnections[i];
        if (connection.connectedTo.start?.slotId === slot.id)
          connection.move(slot.globalPosition, useDelta, 0);
        else if (connection.connectedTo.end?.slotId === slot.id)
          connection.move(slot.globalPosition, useDelta, 1);
      }
    }
  },
  switchInputState(nodes: NodeList, inputId: number): boolean {
    const input = nodes.get(inputId);
    if (input && input.componentType === ComponentType.INPUT) {
      input.state = !input.state;
      return true;
    }
    return false;
  },
};
