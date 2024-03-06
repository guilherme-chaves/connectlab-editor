import ComponentType, {NodeList} from '../../types/types';
import Vector2 from '../../types/Vector2';
import MouseEvents from '../mouseEvents';
import NodeComponent from '../../components/NodeComponent';
import componentEvents from '../Component/componentEvents';

export default {
  // Busca na lista de nodes quais possuem uma colisão com o ponto do mouse
  checkNodeClick(nodes: NodeList, position: Vector2): number[] {
    return componentEvents.checkComponentClick(position, nodes);
  },
  move(
    nodes: NodeList,
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
    const node = nodes.get(nodeCollisions[0]);
    if (node === undefined) return false;
    node.move(v, useDelta);
    this.moveLinkedElements(node, useDelta);
    return true;
  },
  moveLinkedElements(node: NodeComponent, useDelta = true): void {
    node.slotComponents.forEach(slot => {
      slot.update();
      slot.slotConnections.forEach(connection => {
        if (connection.connectedTo.start?.id === slot.id)
          connection.move(slot.globalPosition, useDelta, 0);
        else if (connection.connectedTo.end?.id === slot.id)
          connection.move(slot.globalPosition, useDelta, 1);
      });
    });
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
