import {ComponentType, NodeList} from '@connectlab-editor/types';
import Vector2 from '@connectlab-editor/types/Vector2';
import MouseEvents from '@connectlab-editor/events/mouseEvents';
import NodeComponent from '@connectlab-editor/components/NodeComponent';
import componentEvents from '@connectlab-editor/events/componentEvents';
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
    this.moveLinkedElements(editorEnv, node, useDelta);
    return true;
  },
  moveLinkedElements(
    editorEnv: EditorEnvironment,
    node: NodeComponent,
    useDelta = true
  ): void {
    for (const slotId of node.slotIds) {
      const slot = editorEnv.slots.get(slotId);
      if (!slot) continue;
      slot.update();
      slot.slotConnections.forEach(connection => {
        if (connection.connectedTo.start?.slotId === slot.id)
          connection.move(slot.globalPosition, useDelta, 0);
        else if (connection.connectedTo.end?.slotId === slot.id)
          connection.move(slot.globalPosition, useDelta, 1);
      });
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
