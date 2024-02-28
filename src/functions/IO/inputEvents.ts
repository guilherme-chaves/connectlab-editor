import {Vector} from 'two.js/src/vector';
import InputComponent from '../../components/InputComponent';
import {InputList} from '../../types/types';
import componentEvents from '../Component/componentEvents';
import MouseEvents, {CollisionList} from '../mouseEvents';

export default {
  checkInputClick(inputs: InputList, position: Vector): number[] {
    return componentEvents.checkComponentClick(position, inputs);
  },
  move(
    inputs: InputList,
    collisionList: CollisionList,
    mouseEvents: MouseEvents,
    v: Vector,
    useDelta = true
  ): boolean {
    if (
      collisionList.inputs.length === 0 ||
      (mouseEvents.movingObject !== 'none' &&
        mouseEvents.movingObject !== 'input')
    )
      return false;

    mouseEvents.movingObject = 'input';
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
