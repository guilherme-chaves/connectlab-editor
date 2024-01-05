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
  checkInputClick(position: Vector2): number[] | undefined {
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
    const input = Editor.editorEnv.inputs.get(collisionList.inputs[0])!;
    input.move(v, useDelta);
    this.moveLinkedElements(input, useDelta);
    return true;
  },
  moveLinkedElements(input: InputComponent, useDelta = true): void {
    if (input.slotComponents !== undefined) {
      input.slotComponents[0].update();
      input.slotComponents[0].slotConnections.forEach(connection => {
        if (connection.connectedTo.start?.id === input.slotComponents[0]!.id)
          connection.move(input.slotComponents[0]!.globalPosition, useDelta, 0);
        else if (connection.connectedTo.end?.id === input.slotComponents[0]!.id)
          connection.move(input.slotComponents[0]!.globalPosition, useDelta, 1);
      });
    }
  },
  switchInputState(inputId: number): void {
    const input = Editor.editorEnv.inputs.get(inputId)!;
    input.state = !input.state;
  },
};
