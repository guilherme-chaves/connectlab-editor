import Editor from '../../Editor';
import InputComponent from '../../components/InputComponent';
import Vector2 from '../../types/Vector2';
import componentEvents from '../Component/componentEvents';
import connectionEvents from '../Connection/connectionEvents';
import nodeEvents from '../Node/nodeEvents';
import {CollisionList} from '../mouseEvents';
import outputEvents from './outputEvents';

export default {
  editingInput: false,
  checkInputClick(position: Vector2): string[] | undefined {
    return componentEvents.checkComponentClick(
      position,
      Editor.editorEnv.inputs
    );
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
    const key = Object.values(collisionList.inputs)[0];
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
  switchInputState(inputId: string): void {
    const input = Editor.editorEnv.inputs[inputId];
    input.state = !input.state;
  },
};
