import Vector2 from '../types/Vector2';
import EditorEvents from './events';
import connectionEvents from './Connection/connectionEvents';
import Editor from '../Editor';
import Mouse from '../types/Mouse';
import NodeComponent from '../components/NodeComponent';

export default {
  // Busca na lista de nodes quais possuem uma colisão com o ponto do mouse
  checkNodeClick(): number[] | undefined {
    let collided = false;
    const collidedWith = new Array<number>();
    Object.keys(Editor.editorEnv.getComponents()['nodes']).forEach(key => {
      const keyN = parseInt(key);
      const collision = Editor.editorEnv
        .getComponents()
        ['nodes'][keyN].collisionShape.collisionWithPoint(Mouse.position);
      if (collision) collidedWith.push(keyN);
      collided = collided || collision;
    });
    return collided ? collidedWith : undefined;
  },
  nodeMove(eventsObject: EditorEvents, v: Vector2, useDelta = true): boolean {
    if (
      eventsObject.getCollisionList().nodes !== undefined &&
      !connectionEvents.editingLine
    ) {
      const key = Object.values(
        eventsObject.getCollisionList().nodes as number[]
      )[0];
      const node = Editor.editorEnv.getComponents().nodes[key];
      node.move(v, useDelta);
      this.moveNodeAssociatedElements(node, useDelta);
      return true;
    }
    return false;
  },
  moveNodeAssociatedElements(node: NodeComponent, useDelta = true): void {
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
