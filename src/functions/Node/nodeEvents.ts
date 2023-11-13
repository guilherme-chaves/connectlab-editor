import Vector2 from '../../types/Vector2';
import MouseEvents from '../mouseEvents';
import connectionEvents from '../Connection/connectionEvents';
import Editor from '../../Editor';
import Mouse from '../../types/Mouse';
import NodeComponent from '../../components/NodeComponent';
import inputEvents from '../IO/inputEvents';

export default {
  editingNode: false,
  // Busca na lista de nodes quais possuem uma colisão com o ponto do mouse
  checkNodeClick(): number[] | undefined {
    let collided = false;
    const collidedWith = new Array<number>();
    Object.keys(Editor.editorEnv.nodes).forEach(key => {
      const keyN = parseInt(key);
      const collision = Editor.editorEnv.nodes[
        keyN
      ].collisionShape.collisionWithPoint(Mouse.position);
      if (collision) collidedWith.push(keyN);
      collided = collided || collision;
    });
    return collided ? collidedWith : undefined;
  },
  move(mouseEvents: MouseEvents, v: Vector2, useDelta = true): boolean {
    if (
      mouseEvents.getCollisionList().nodes === undefined ||
      connectionEvents.editingLine ||
      inputEvents.editingInput
    ) {
      this.editingNode = false;
      return false;
    }

    this.editingNode = true;
    const key = Object.values(
      mouseEvents.getCollisionList().nodes as number[]
    )[0];
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
