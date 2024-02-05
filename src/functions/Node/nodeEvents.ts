import {NodeList, RenderGraph} from '../../types/types';
import {CollisionList} from '../mouseEvents';
import connectionEvents from '../Connection/connectionEvents';
import NodeComponent from '../../components/NodeComponent';
import inputEvents from '../IO/inputEvents';
import outputEvents from '../IO/outputEvents';
import componentEvents from '../Component/componentEvents';
import Point2i from '../../types/Point2i';
import {Line} from '../../interfaces/renderObjects';

export default {
  editingNode: false,
  // Busca na lista de nodes quais possuem uma colisão com o ponto do mouse
  checkNodeClick(nodes: NodeList, position: Point2i): number[] | undefined {
    return componentEvents.checkComponentClick(position, nodes);
  },
  move(
    nodeId: number,
    renderGraph: RenderGraph,
    nodeList: NodeList,
    collisionList: CollisionList,
    v: Point2i,
    useDelta = true
  ): boolean {
    if (
      collisionList.nodes === undefined ||
      connectionEvents.editingLine ||
      inputEvents.editingInput ||
      outputEvents.editingOutput
    ) {
      this.editingNode = false;
      return false;
    }

    this.editingNode = true;
    renderGraph.get(nodeId)!.move(v, useDelta);
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
      renderGraph.get(node.slotComponents[0].id)!.move(v, false);
      slot.slotConnections.forEach(connection => {
        if (connection.connectedTo.start?.id === slot.id)
          (renderGraph.get(connection.id)! as unknown as Line).move(
            v,
            useDelta,
            0
          );
        else if (connection.connectedTo.end?.id === slot.id)
          (renderGraph.get(connection.id)! as unknown as Line).move(
            v,
            useDelta,
            0
          );
      });
    });
  },
};
