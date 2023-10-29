import Vector2 from '../types/Vector2';
import EditorEvents from './events';
import connectionEvents from './Connection/connectionEvents';
import Editor from '../Editor';
import Mouse from '../types/Mouse';

export default {
  // Busca na lista de nodes quais possuem uma colisão com o ponto do mouse
  checkNodeClick(): number[] | undefined {
    let collided = false;
    const collidedWith = new Array<number>();
    Object.keys(Editor.editorEnv.getComponents()['nodes']).forEach(key => {
      const keyN = parseInt(key);
      const collision = Editor.editorEnv
        .getComponents()
        ['nodes'][keyN].getCollisionShape()
        .collisionWithPoint(Mouse.position);
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
      node.changePosition(v, useDelta);
      node.getSlotComponents().forEach(slotKey => {
        const slot = Editor.editorEnv.getComponents().slots[slotKey];
        slot.setParentPosition(
          Editor.editorEnv.getComponents().nodes[key].position
        );
        const connectionKey = slot.getConnectionId();
        if (connectionKey !== -1) {
          const connection =
            Editor.editorEnv.getComponents().connections[connectionKey];
          if (connection.connectedTo.start?.id === slotKey)
            connection.changePosition(slot.getGlobalPosition(), 0, useDelta);
          else if (connection.connectedTo.end?.id === slotKey)
            connection.changePosition(slot.getGlobalPosition(), 1, useDelta);
        }
      });
      return true;
    }
    return false;
  },
};
