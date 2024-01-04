import Editor from '../../Editor';
import OutputComponent from '../../components/OutputComponent';
import Vector2 from '../../types/Vector2';
import connectionEvents from '../Connection/connectionEvents';
import nodeEvents from '../Node/nodeEvents';
import inputEvents from './inputEvents';
import {CollisionList} from '../mouseEvents';
import componentEvents from '../Component/componentEvents';

export default {
  editingOutput: false,
  checkOutputClick(position: Vector2): number[] | undefined {
    return componentEvents.checkComponentClick(
      position,
      Editor.editorEnv.outputs
    );
  },
  move(collisionList: CollisionList, v: Vector2, useDelta = true): boolean {
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
    const output = Editor.editorEnv.outputs.get(collisionList.outputs[0])!;
    output.move(v, useDelta);
    this.moveLinkedElements(output, useDelta);
    return true;
  },
  moveLinkedElements(output: OutputComponent, useDelta = true): void {
    if (output.slotComponent !== undefined) {
      output.slotComponent.update();
      output.slotComponent.slotConnections.forEach(connection => {
        if (connection.connectedTo.start?.id === output.slotComponent!.id)
          connection.move(output.slotComponent!.globalPosition, useDelta, 0);
        else if (connection.connectedTo.end?.id === output.slotComponent!.id)
          connection.move(output.slotComponent!.globalPosition, useDelta, 1);
      });
    }
  },
};
