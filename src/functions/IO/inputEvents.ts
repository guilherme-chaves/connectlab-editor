import InputComponent from '../../components/InputComponent';
import Vector2 from '../../types/Vector2';
import {InputList} from '../../types/types';
import componentEvents from '../Component/componentEvents';
import MouseEvents from '../mouseEvents';

export default {
  checkInputClick(inputs: InputList, position: Vector2): number[] {
    return componentEvents.checkComponentClick(position, inputs);
  },
  move(
    inputs: InputList,
    mouseEvents: MouseEvents,
    v: Vector2,
    useDelta = true
  ): boolean {
    const inputCollisions = mouseEvents.getCollisionList().inputs;
    if (
      inputCollisions.length === 0 ||
      !(
        mouseEvents.movingObject === 'none' ||
        mouseEvents.movingObject === 'input'
      )
    )
      return false;

    mouseEvents.movingObject = 'input';
    const input = inputs.get(inputCollisions[0]);
    if (input === undefined) return false;
    input.move(v, useDelta);
    this.moveLinkedElements(input, useDelta);
    return true;
  },
  moveLinkedElements(input: InputComponent, useDelta = true): void {
    if (input.slotComponents !== undefined) {
      input.slotComponents[0].update();
      input.slotComponents[0].slotConnections.forEach(connection => {
        if (connection.connectedTo.start?.id === input.slotComponents[0].id)
          connection.move(input.slotComponents[0]!.globalPosition, useDelta, 0);
        else if (connection.connectedTo.end?.id === input.slotComponents[0].id)
          connection.move(input.slotComponents[0]!.globalPosition, useDelta, 1);
      });
    }
  },
  switchInputState(inputs: InputList, inputId: number): void {
    const input = inputs.get(inputId);
    if (input) input.state = !input.state;
  },
};
