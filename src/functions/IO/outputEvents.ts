import OutputComponent from '../../components/OutputComponent';
import Vector2 from '../../types/Vector2';
import connectionEvents from '../Connection/connectionEvents';
import nodeEvents from '../Node/nodeEvents';
import inputEvents from './inputEvents';
import {CollisionList} from '../mouseEvents';
import componentEvents from '../Component/componentEvents';
import {OutputList} from '../../types/types';

export default {
  editingOutput: false,
  checkOutputClick(
    outputs: OutputList,
    position: Vector2
  ): number[] | undefined {
    return componentEvents.checkComponentClick(position, outputs);
  },
  move(
    outputs: OutputList,
    collisionList: CollisionList,
    v: Vector2,
    useDelta = true
  ): boolean {
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
    const output = outputs.get(collisionList.outputs[0]);
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
