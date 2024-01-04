import Vector2 from '../../types/Vector2';
import {CollisionList} from '../mouseEvents';
import connectionEvents from '../Connection/connectionEvents';
import Editor from '../../Editor';
import NodeComponent from '../../components/NodeComponent';
import inputEvents from '../IO/inputEvents';
import outputEvents from '../IO/outputEvents';
import componentEvents from '../Component/componentEvents';

export default {
  editingNode: false,
  // Busca na lista de nodes quais possuem uma colisão com o ponto do mouse
  checkNodeClick(position: Vector2): number[] | undefined {
    return componentEvents.checkComponentClick(
      position,
      Editor.editorEnv.nodes
    );
  },
  move(collisionList: CollisionList, v: Vector2, useDelta = true): boolean {
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
    const node = Editor.editorEnv.nodes.get(collisionList.nodes[0])!;
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
