import {NodeList} from '../../types/types';
import MouseEvents, {CollisionList} from '../mouseEvents';
import NodeComponent from '../../components/NodeComponent';
import componentEvents from '../Component/componentEvents';
import {Vector} from 'two.js/src/vector';

export default {
  // Busca na lista de nodes quais possuem uma colisão com o ponto do mouse
  checkNodeClick(nodes: NodeList, position: Vector): number[] {
    return componentEvents.checkComponentClick(position, nodes);
  },
  move(
    nodes: NodeList,
    collisionList: CollisionList,
    mouseEvents: MouseEvents,
    v: Vector,
    useDelta = true
  ): boolean {
    if (
      collisionList.nodes.length === 0 ||
      (mouseEvents.movingObject !== 'none' &&
        mouseEvents.movingObject !== 'node')
    )
      return false;

    mouseEvents.movingObject = 'node';
    const node = nodes.get(collisionList.nodes[0])!;
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
};
