import InputComponent from '../../components/InputComponent';
import {Line} from '../../interfaces/renderObjects';
import Point2i from '../../types/Point2i';
import {InputList, RenderGraph, SignalGraph} from '../../types/types';
import componentEvents from '../Component/componentEvents';
import connectionEvents from '../Connection/connectionEvents';
import nodeEvents from '../Node/nodeEvents';
import {CollisionList} from '../mouseEvents';
import outputEvents from './outputEvents';

export default {
  editingInput: false,
  checkInputClick(inputs: InputList, position: Point2i): number[] | undefined {
    return componentEvents.checkComponentClick(position, inputs);
  },
  move(
    inputId: number,
    renderGraph: RenderGraph,
    inputList: InputList,
    collisionList: CollisionList,
    v: Point2i,
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
    renderGraph.get(inputId)!.move(v, useDelta);
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
      renderGraph.get(input.slotComponents[0].id)!.move(v, false);
      input.slotComponents[0].slotConnections.forEach(connection => {
        if (connection.connectedTo.start?.id === input.slotComponents[0]!.id)
          (renderGraph.get(connection.id)! as unknown as Line).move(
            v,
            useDelta,
            0
          );
        else if (connection.connectedTo.end?.id === input.slotComponents[0]!.id)
          (renderGraph.get(connection.id)! as unknown as Line).move(
            v,
            useDelta,
            0
          );
      });
    }
  },
  switchInputState(signalGraph: SignalGraph, inputId: number): void {
    signalGraph.get(inputId)!.state = !signalGraph.get(inputId)!.state;
  },
};
