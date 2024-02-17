import {NodeList, RenderGraph} from '../../types/types';
import MouseEvents, {CollisionList} from '../mouseEvents';
import NodeComponent from '../../components/NodeComponent';
import componentEvents from '../Component/componentEvents';
import Point2i from '../../types/Point2i';

export default {
  editingNode: false,
  // Busca na lista de nodes quais possuem uma colisão com o ponto do mouse
  checkNodeClick(nodes: NodeList, position: Point2i): number[] {
    return componentEvents.checkComponentClick(position, nodes);
  },
  move(
    nodeId: number,
    renderGraph: RenderGraph,
    nodeList: NodeList,
    collisionList: CollisionList,
    mouseEvents: MouseEvents,
    v: Point2i,
    useDelta = true
  ): boolean {
    if (
      collisionList.nodes === undefined ||
      (mouseEvents.movingObject !== 'none' &&
        mouseEvents.movingObject !== 'node')
    )
      return false;

    mouseEvents.movingObject = 'node';
    renderGraph.get(nodeId)!.object!.move(v, useDelta);
    this.moveLinkedElements(renderGraph, nodeList.get(nodeId)!, v, useDelta);
    return true;
  },
  moveLinkedElements(
    renderGraph: RenderGraph,
    node: NodeComponent,
    v: Point2i,
    useDelta = true
  ): void {
    node.slotComponents.forEach(slot => {
      renderGraph.get(node.slotComponents[0].id)!.object!.move(v, false);
      slot.slotConnections.forEach(connection => {
        if (connection.connectedTo.start?.id === slot.id)
          renderGraph.get(connection.id)!.line!.move(v, useDelta, 0);
        else if (connection.connectedTo.end?.id === slot.id)
          renderGraph.get(connection.id)!.line!.move(v, useDelta, 1);
      });
    });
  },
};
