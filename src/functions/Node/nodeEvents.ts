import {NodeList} from '../../types/types';
import MouseEvents, {CollisionList} from '../mouseEvents';
import NodeComponent from '../../components/NodeComponent';
import componentEvents from '../Component/componentEvents';
import Point2i from '../../types/Point2i';
import Node from '../../interfaces/nodeInterface';
import Vector2i from '../../types/Vector2i';
import connectionPath from '../Connection/connectionPath';

export default {
  editingNode: false,
  // Busca na lista de nodes quais possuem uma colisão com o ponto do mouse
  checkNodeClick(nodes: NodeList, position: Point2i): number[] {
    return componentEvents.checkComponentClick(position, nodes);
  },
  move(
    nodeId: number,
    nodeList: NodeList,
    collisionList: CollisionList,
    mouseEvents: MouseEvents,
    v: Point2i,
    useDelta = false
  ): boolean {
    if (
      collisionList.nodes === undefined ||
      (mouseEvents.movingObject !== 'none' &&
        mouseEvents.movingObject !== 'node')
    )
      return false;

    mouseEvents.movingObject = 'node';
    const node = nodeList.get(nodeId)!;
    node.collisionShape.drawShape?.update();
    v = this.centerMovePosition(node, v);
    node.drawShape?.move(v, useDelta);
    this.moveLinkedElements(node, v, useDelta);
    return true;
  },
  moveLinkedElements(node: NodeComponent, v: Point2i, useDelta = true): void {
    for (let i = 0; i < node.slotComponents.length; i++) {
      const slot = node.slotComponents[i];
      slot.drawShape?.move(v, useDelta);
      slot.collisionShape.drawShape?.update();
      for (let j = 0; j < slot.slotConnections.length; j++) {
        const connection = slot.slotConnections[j];
        const slotPosition = Vector2i.add(v, slot.position);
        if (connection.connectedTo.start?.id === slot.id)
          connection.drawShape?.move(slotPosition, useDelta, 0);
        else if (connection.connectedTo.end?.id === slot.id)
          connection.drawShape?.move(slotPosition, useDelta, 1);
        connectionPath.generateCollisionShapes(connection);
      }
    }
  },
  centerMovePosition(node: Node, v: Point2i): Point2i {
    if (!node.drawShape) return v;
    return new Point2i(
      v.x - node.drawShape.imageWidth / 2,
      v.y - node.drawShape.imageHeight / 2
    );
  },
};
