import InputComponent from '../../components/InputComponent';
import Vector2 from '../../types/Vector2';
import {InputList} from '../../types/types';
import componentEvents from '../Component/componentEvents';
import connectionEvents from '../Connection/connectionEvents';
import nodeEvents from '../Node/nodeEvents';
import {CollisionList} from '../mouseEvents';
import outputEvents from './outputEvents';

export default {
  editingInput: false,
  checkInputClick(inputs: InputList, position: Vector2): number[] | undefined {
    return componentEvents.checkComponentClick(position, inputs);
  },
  move(
    inputs: InputList,
    collisionList: CollisionList,
    v: Vector2,
    useDelta = true
  ): boolean {
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
    const input = inputs.get(collisionList.inputs[0])!;
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
  switchInputState(inputs: InputList, inputId: number): void {
    const input = inputs.get(inputId)!;
    input.state = !input.state;
  },
};
