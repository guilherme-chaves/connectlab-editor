import Editor from '../../Editor';
import InputComponent from '../../components/InputComponent';
import Mouse from '../../types/Mouse';
import Vector2 from '../../types/Vector2';
import connectionEvents from '../Connection/connectionEvents';
import nodeEvents from '../Node/nodeEvents';
import MouseEvents from '../mouseEvents';

export default {
  editingInput: false,
  checkInputClick(): number[] | undefined {
    let collided = false;
    const collidedWith = Array<number>();
    Object.keys(Editor.editorEnv.inputs).forEach(key => {
      const keyN = parseInt(key);
      const collision = Editor.editorEnv.inputs[
        keyN
      ].collisionShape.collisionWithPoint(Mouse.position);
      if (collision) collidedWith.push(keyN);
      collided = collided || collision;
    });
    return collided ? collidedWith : undefined;
  },
  move(mouseEvents: MouseEvents, v: Vector2, useDelta = true): boolean {
    if (
      mouseEvents.getCollisionList().inputs === undefined ||
      connectionEvents.editingLine ||
      nodeEvents.editingNode
    ) {
      this.editingInput = false;
      return false;
    }

    this.editingInput = true;
    const key = Object.values(
      mouseEvents.getCollisionList().inputs as number[]
    )[0];
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
};
