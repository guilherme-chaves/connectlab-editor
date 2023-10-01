import Vector2 from '../types/Vector2';
import EditorEvents from './events';
import connectionEvents from './Connection/connectionEvents';
import Editor from '../Editor';

export default {
  // Busca na lista de nodes quais possuem uma colisão com o ponto do mouse
  checkNodeClick(eventsObject: EditorEvents): number[] | undefined {
    let collided = false;
    const collidedWith = new Array<number>();
    Object.keys(Editor.editorEnv.getComponents()['nodes']).forEach(key => {
      const keyN = parseInt(key);
      const collision = Editor.editorEnv
        .getComponents()
        ['nodes'][keyN].getCollisionShape()
        .collisionWithPoint(eventsObject.getMousePosition());
      if (collision) collidedWith.push(keyN);
      collided = collided || collision;
    });
    return collided ? collidedWith : undefined;
  },
  nodeMove(eventsObject: EditorEvents, delta: Vector2): boolean {
    if (
      eventsObject.getCollisionList().nodes !== undefined &&
      eventsObject.getMouseChangedPosition() &&
      !connectionEvents.editingLine
    ) {
      const key = Object.values(
        eventsObject.getCollisionList().nodes as number[]
      )[0];
      Editor.editorEnv.getComponents().nodes[key].changePosition(delta);
      Editor.editorEnv
        .getComponents()
        .nodes[key].getSlotComponents()
        .forEach(slotKey => {
          Editor.editorEnv
            .getComponents()
            .slots[slotKey].setParentPosition(
              Editor.editorEnv.getComponents().nodes[key].position
            );
          Editor.editorEnv
            .getComponents()
            .slots[slotKey].getCollisionShape()
            .moveShape(delta);
          if (
            Editor.editorEnv
              .getComponents()
              .slots[slotKey].getConnectionId() !== -1
          ) {
            const connectionKey = Editor.editorEnv
              .getComponents()
              .slots[slotKey].getConnectionId();
            if (
              Editor.editorEnv.getComponents().connections[connectionKey]
                .connectedTo.start?.id === slotKey
            )
              Editor.editorEnv
                .getComponents()
                .connections[connectionKey].changePosition(delta, 0, true);
            else if (
              Editor.editorEnv.getComponents().connections[connectionKey]
                .connectedTo.end?.id === slotKey
            )
              Editor.editorEnv
                .getComponents()
                .connections[connectionKey].changePosition(delta, 1, true);
          }
        });
      return true;
    }
    return false;
  },
};
