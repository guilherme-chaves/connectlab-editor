import EditorEnvironment from '../../EditorEnvironment';
import InputComponent from '../../components/InputComponent';
import Point2i from '../../types/Point2i';
import Vector2i from '../../types/Vector2i';
import {InputList} from '../../types/types';
import componentEvents from '../Component/componentEvents';
import connectionPath from '../Connection/connectionPath';
import nodeEvents from '../Node/nodeEvents';
import MouseEvents, {CollisionList} from '../mouseEvents';

export default {
  editingInput: false,
  checkInputClick(inputs: InputList, position: Point2i): number[] {
    return componentEvents.checkComponentClick(position, inputs);
  },
  move(
    inputId: number,
    inputList: InputList,
    collisionList: CollisionList,
    mouseEvents: MouseEvents,
    v: Point2i,
    useDelta = true
  ): boolean {
    if (
      collisionList.inputs.length === 0 ||
      (mouseEvents.movingObject !== 'none' &&
        mouseEvents.movingObject !== 'input')
    )
      return false;

    const input = inputList.get(inputId)!;
    input.collisionShape.drawShape?.update();
    mouseEvents.movingObject = 'input';
    v = nodeEvents.centerMovePosition(input, v);
    input.drawShape?.move(v, useDelta);
    this.moveLinkedElements(input, v, useDelta);
    return true;
  },
  moveLinkedElements(input: InputComponent, v: Point2i, useDelta = true): void {
    for (let i = 0; i < input.slotComponents.length; i++) {
      const slot = input.slotComponents[i];
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
  switchInputState(editorEnv: EditorEnvironment, inputId: number): void {
    editorEnv.signalGraph.get(inputId)!.state =
      !editorEnv.signalGraph.get(inputId)!.state;

    if (editorEnv.editorRenderer)
      editorEnv.inputs.get(inputId)!.drawShape!.currentSpriteId =
        editorEnv.inputs.get(inputId)!.nodeType.imgPaths[
          editorEnv.signalGraph.get(inputId)!.state ? 1 : 0
        ];
  },
};
