import Vector2 from '../../types/Vector2';
import {CollisionList} from '../mouseEvents';
import connectionEvents from '../Connection/connectionEvents';
import Editor from '../../Editor';
import NodeComponent from '../../components/NodeComponent';
import inputEvents from '../IO/inputEvents';

export default {
  editingNode: false,
  // Busca na lista de nodes quais possuem uma colisão com o ponto do mouse
  checkNodeClick(position: Vector2): number[] | undefined {
    let collided = false;
    const collidedWith = new Array<number>();
    Object.keys(Editor.editorEnv.nodes).forEach(key => {
      const keyN = parseInt(key);
      const collision =
        Editor.editorEnv.nodes[keyN].collisionShape.collisionWithPoint(
          position
        );
      if (collision) collidedWith.push(keyN);
      collided = collided || collision;
    });
    return collided ? collidedWith : undefined;
  },
  move(collisionList: CollisionList, v: Vector2, useDelta = true): boolean {
    if (
      collisionList.nodes === undefined ||
      connectionEvents.editingLine ||
      inputEvents.editingInput
    ) {
      this.editingNode = false;
      return false;
    }

    this.editingNode = true;
    const key = Object.values(collisionList.nodes as number[])[0];
    const node = Editor.editorEnv.nodes[key];
    node.move(v, useDelta);
    this.moveLinkedElements(node, useDelta);
    return true;
  },
  moveLinkedElements(node: NodeComponent, useDelta = true): void {
    node.slotComponents.forEach(slot => {
      slot.update();
      slot.slotConnections.forEach(connection => {
        if (connection.connectedTo.start?.id === slot.id)
          connection.move(slot.globalPosition, 0, useDelta);
        else if (connection.connectedTo.end?.id === slot.id)
          connection.move(slot.globalPosition, 1, useDelta);
      });
    });
  },
};
