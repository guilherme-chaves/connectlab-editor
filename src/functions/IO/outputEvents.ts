import OutputComponent from '../../components/OutputComponent';
import MouseEvents, {CollisionList} from '../mouseEvents';
import componentEvents from '../Component/componentEvents';
import {OutputList} from '../../types/types';
import Point2i from '../../types/Point2i';
import nodeEvents from '../Node/nodeEvents';
import Vector2i from '../../types/Vector2i';
import connectionPath from '../Connection/connectionPath';

export default {
  editingOutput: false,
  checkOutputClick(outputs: OutputList, position: Point2i): number[] {
    return componentEvents.checkComponentClick(position, outputs);
  },
  move(
    outputId: number,
    outputList: OutputList,
    collisionList: CollisionList,
    mouseEvents: MouseEvents,
    v: Point2i,
    useDelta = true
  ): boolean {
    if (
      collisionList.outputs.length === 0 ||
      (mouseEvents.movingObject !== 'none' &&
        mouseEvents.movingObject !== 'output')
    )
      return false;

    mouseEvents.movingObject = 'output';
    const output = outputList.get(outputId)!;
    output.collisionShape.drawShape?.update();
    v = nodeEvents.centerMovePosition(output, v);
    output.drawShape?.move(v, useDelta);
    this.moveLinkedElements(output, v, useDelta);
    return true;
  },
  moveLinkedElements(
    output: OutputComponent,
    v: Point2i,
    useDelta = true
  ): void {
    for (let i = 0; i < output.slotComponents.length; i++) {
      const slot = output.slotComponents[i];
      slot.drawShape?.move(v, useDelta);
      slot.collisionShape.drawShape?.update();
      for (let j = 0; j < slot.slotConnections.length; j++) {
        const connection = slot.slotConnections[j];
        const slotPosition = Vector2i.add(v, slot.position);
        if (connection.connectedTo.start?.id === slot.id)
          connection.drawShape?.move(slotPosition, useDelta, 0);
        else if (connection.connectedTo.end?.id === slot.id)
          connection.drawShape?.move(slotPosition, useDelta, 1);
        connectionPath.generateCollisionShapes(connection);
      }
    }
  },
};
