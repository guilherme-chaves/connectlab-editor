import EditorEnvironment from '../../EditorEnvironment';
import InputComponent from '../../components/InputComponent';
import Sprite from '../../renderer/canvas/objects/Sprite';
import Point2i from '../../types/Point2i';
import {InputList, RenderGraph} from '../../types/types';
import componentEvents from '../Component/componentEvents';
import MouseEvents, {CollisionList} from '../mouseEvents';

export default {
  editingInput: false,
  checkInputClick(inputs: InputList, position: Point2i): number[] {
    return componentEvents.checkComponentClick(position, inputs);
  },
  move(
    inputId: number,
    renderGraph: RenderGraph,
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

    mouseEvents.movingObject = 'input';
    renderGraph.get(inputId)!.object!.move(v, useDelta);
    this.moveLinkedElements(renderGraph, inputList.get(inputId)!, v, useDelta);
    return true;
  },
  moveLinkedElements(
    renderGraph: RenderGraph,
    input: InputComponent,
    v: Point2i,
    useDelta = true
  ): void {
    if (input.slotComponents !== undefined) {
      renderGraph.get(input.slotComponents[0].id)!.object!.move(v, false);
      input.slotComponents[0].slotConnections.forEach(connection => {
        if (connection.connectedTo.start?.id === input.slotComponents[0]!.id)
          renderGraph.get(connection.id)!.line!.move(v, useDelta, 0);
        else if (connection.connectedTo.end?.id === input.slotComponents[0]!.id)
          renderGraph.get(connection.id)!.line!.move(v, useDelta, 1);
      });
    }
  },
  switchInputState(editorEnv: EditorEnvironment, inputId: number): void {
    editorEnv.signalGraph.get(inputId)!.state =
      !editorEnv.signalGraph.get(inputId)!.state;
    (
      editorEnv.editorRenderer?.renderGraph.get(inputId)!.object as Sprite
    ).currentSpriteId =
      editorEnv.inputs.get(inputId)!.nodeType.imgPaths[
        editorEnv.signalGraph.get(inputId)!.state ? 1 : 0
      ];
  },
};
