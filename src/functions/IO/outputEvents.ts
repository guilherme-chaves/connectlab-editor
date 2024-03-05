import OutputComponent from '../../components/OutputComponent';
import Vector2 from '../../types/Vector2';
import MouseEvents from '../mouseEvents';
import componentEvents from '../Component/componentEvents';
import {OutputList} from '../../types/types';

export default {
  checkOutputClick(outputs: OutputList, position: Vector2): number[] {
    return componentEvents.checkComponentClick(position, outputs);
  },
  move(
    outputs: OutputList,
    mouseEvents: MouseEvents,
    v: Vector2,
    useDelta = true
  ): boolean {
    const outputCollisions = mouseEvents.getCollisionList().outputs;
    if (
      outputCollisions.length === 0 ||
      !(
        mouseEvents.movingObject === 'none' ||
        mouseEvents.movingObject === 'output'
      )
    )
      return false;

    mouseEvents.movingObject = 'output';
    const output = outputs.get(outputCollisions[0]);
    if (output === undefined) return false;
    output.move(v, useDelta);
    this.moveLinkedElements(output, useDelta);
    return true;
  },
  moveLinkedElements(output: OutputComponent, useDelta = true): void {
    if (output.slotComponents[0] !== undefined) {
      output.slotComponents[0].update();
      output.slotComponents[0].slotConnections.forEach(connection => {
        if (connection.connectedTo.start?.id === output.slotComponents[0].id)
          connection.move(
            output.slotComponents[0]!.globalPosition,
            useDelta,
            0
          );
        else if (connection.connectedTo.end?.id === output.slotComponents[0].id)
          connection.move(
            output.slotComponents[0]!.globalPosition,
            useDelta,
            1
          );
      });
    }
  },
};
