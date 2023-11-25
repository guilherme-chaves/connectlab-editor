import Editor from '../../Editor';
import InputComponent from '../../components/InputComponent';
import Vector2 from '../../types/Vector2';
import connectionEvents from '../Connection/connectionEvents';
import nodeEvents from '../Node/nodeEvents';
import {CollisionList} from '../mouseEvents';
import outputEvents from './outputEvents';

export default {
  editingInput: false,
  checkInputClick(position: Vector2): number[] | undefined {
    let collided = false;
    const collidedWith = Array<number>();
    Object.keys(Editor.editorEnv.inputs).forEach(key => {
      const keyN = parseInt(key);
      const collision =
        Editor.editorEnv.inputs[keyN].collisionShape.collisionWithPoint(
          position
        );
      if (collision) collidedWith.push(keyN);
      collided = collided || collision;
    });
    return collided ? collidedWith : undefined;
  },
  move(collisionList: CollisionList, v: Vector2, useDelta = true): boolean {
    if (
      collisionList.inputs === undefined ||
      connectionEvents.editingLine ||
      nodeEvents.editingNode ||
      outputEvents.editingOutput
    ) {
      this.editingInput = false;
      return false;
    }

    this.editingInput = true;
    const key = Object.values(collisionList.inputs as number[])[0];
    const input = Editor.editorEnv.inputs[key];
    input.move(v, useDelta);
    this.moveLinkedElements(input, useDelta);
    return true;
  },
  moveLinkedElements(input: InputComponent, useDelta = true): void {
    if (input.slotComponent !== undefined) {
      input.slotComponent.update();
      input.slotComponent.slotConnections.forEach(connection => {
        if (connection.connectedTo.start?.id === input.slotComponent!.id)
          connection.move(input.slotComponent!.globalPosition, 0, useDelta);
        else if (connection.connectedTo.end?.id === input.slotComponent!.id)
          connection.move(input.slotComponent!.globalPosition, 1, useDelta);
      });
    }
  },
  switchInputState(inputId: number): void {
    const input = Editor.editorEnv.inputs[inputId];
    input.state = !input.state;
  },
};
