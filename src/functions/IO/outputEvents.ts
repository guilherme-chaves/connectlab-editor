import Editor from '../../Editor';
import OutputComponent from '../../components/OutputComponent';
import Vector2 from '../../types/Vector2';
import connectionEvents from '../Connection/connectionEvents';
import nodeEvents from '../Node/nodeEvents';
import inputEvents from './inputEvents';
import {CollisionList} from '../mouseEvents';

export default {
  editingOutput: false,
  checkOutputClick(position: Vector2): number[] | undefined {
    let collided = false;
    const collidedWith = Array<number>();
    Object.keys(Editor.editorEnv.outputs).forEach(key => {
      const keyN = parseInt(key);
      const collision =
        Editor.editorEnv.outputs[keyN].collisionShape.collisionWithPoint(
          position
        );
      if (collision) collidedWith.push(keyN);
      collided = collided || collision;
    });
    return collided ? collidedWith : undefined;
  },
  move(collisionList: CollisionList, v: Vector2, useDelta = true): boolean {
    if (
      collisionList.outputs === undefined ||
      connectionEvents.editingLine ||
      nodeEvents.editingNode ||
      inputEvents.editingInput
    ) {
      this.editingOutput = false;
      return false;
    }

    this.editingOutput = true;
    const key = Object.values(collisionList.outputs)[0];
    const output = Editor.editorEnv.outputs[key];
    output.move(v, useDelta);
    this.moveLinkedElements(output, useDelta);
    return true;
  },
  moveLinkedElements(output: OutputComponent, useDelta = true): void {
    if (output.slotComponent !== undefined) {
      output.slotComponent.update();
      output.slotComponent.slotConnections.forEach(connection => {
        if (connection.connectedTo.start?.id === output.slotComponent!.id)
          connection.move(output.slotComponent!.globalPosition, 0, useDelta);
        else if (connection.connectedTo.end?.id === output.slotComponent!.id)
          connection.move(output.slotComponent!.globalPosition, 1, useDelta);
      });
    }
  },
};
