import OutputComponent from '../../components/OutputComponent';
import MouseEvents, {CollisionList} from '../mouseEvents';
import componentEvents from '../Component/componentEvents';
import {OutputList, RenderGraph} from '../../types/types';
import Point2i from '../../types/Point2i';

export default {
  editingOutput: false,
  checkOutputClick(outputs: OutputList, position: Point2i): number[] {
    return componentEvents.checkComponentClick(position, outputs);
  },
  move(
    outputId: number,
    renderGraph: RenderGraph,
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
    renderGraph.get(outputId)!.object!.move(v, useDelta);
    this.moveLinkedElements(
      renderGraph,
      outputList.get(outputId)!,
      v,
      useDelta
    );
    return true;
  },
  moveLinkedElements(
    renderGraph: RenderGraph,
    output: OutputComponent,
    v: Point2i,
    useDelta = true
  ): void {
    if (output.slotComponents !== undefined) {
      renderGraph.get(output.slotComponents[0].id)!.object!.move(v, false);
      output.slotComponents[0].slotConnections.forEach(connection => {
        if (connection.connectedTo.start?.id === output.slotComponents[0]!.id)
          renderGraph.get(connection.id)!.line!.move(v, useDelta, 0);
        else if (
          connection.connectedTo.end?.id === output.slotComponents[0]!.id
        )
          renderGraph.get(connection.id)!.line!.move(v, useDelta, 1);
      });
    }
  },
};
