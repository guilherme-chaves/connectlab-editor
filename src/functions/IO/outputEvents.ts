import OutputComponent from '../../components/OutputComponent';
import MouseEvents, {CollisionList} from '../mouseEvents';
import componentEvents from '../Component/componentEvents';
import {OutputList} from '../../types/types';
import {Vector} from 'two.js/src/vector';

export default {
  checkOutputClick(outputs: OutputList, position: Vector): number[] {
    return componentEvents.checkComponentClick(position, outputs);
  },
  move(
    outputs: OutputList,
    collisionList: CollisionList,
    mouseEvents: MouseEvents,
    v: Vector,
    useDelta = true
  ): boolean {
    if (
      collisionList.outputs.length === 0 ||
      (mouseEvents.movingObject !== 'none' &&
        mouseEvents.movingObject !== 'output')
    )
      return false;

    mouseEvents.movingObject = 'output';
    const output = outputs.get(collisionList.outputs[0])!;
    output.move(v, useDelta);
    this.moveLinkedElements(output, useDelta);
    return true;
  },
  moveLinkedElements(output: OutputComponent, useDelta = true): void {
    if (output.slotComponents[0] !== undefined) {
      output.slotComponents[0].update();
      output.slotComponents[0].slotConnections.forEach(connection => {
        if (connection.connectedTo.start?.id === output.slotComponents[0]!.id)
          connection.move(
            output.slotComponents[0]!.globalPosition,
            useDelta,
            0
          );
        else if (
          connection.connectedTo.end?.id === output.slotComponents[0]!.id
        )
          connection.move(
            output.slotComponents[0]!.globalPosition,
            useDelta,
            1
          );
      });
    }
  },
};
