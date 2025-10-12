import Vector2i from '@connectlab-editor/types/vector2i';
import { ConnectionList } from '@connectlab-editor/types/common';
// import {ComponentType} from '@connectlab-editor/types/enums';
import slotEvents from '@connectlab-editor/events/slotEvents';
import SlotComponent from '@connectlab-editor/components/slotComponent';
import SignalEvents from '@connectlab-editor/events/signalEvents';
import EditorEnvironment from '@connectlab-editor/environment';
import MouseEvents from '@connectlab-editor/events/mouseEvents';
import ConnectionComponent, {
  MovePointEnum,
} from '@connectlab-editor/components/connectionComponent';
import addComponent from '@connectlab-editor/functions/addComponent';
import removeComponent from '@connectlab-editor/functions/removeComponent';

type ConnectionEventsType = {
  editingLine: ConnectionComponent | undefined
  startSlot: SlotComponent | undefined
  endSlot: SlotComponent | undefined
  oldStartSlot: SlotComponent | undefined
  oldEndSlot: SlotComponent | undefined
  movePoint: MovePointEnum
  reset(): void
  checkConnectionClick(
    connections: ConnectionList,
    position: Vector2i
  ): number[]
  newConnection(editorEnv: EditorEnvironment, slotId: number): boolean
  move(editorEnv: EditorEnvironment, position: Vector2i): boolean
  setConnectionProps(editorEnv: EditorEnvironment): boolean
  isValidPosition(editorEnv: EditorEnvironment, position: Vector2i): boolean
  bindLine(editorEnv: EditorEnvironment, position: Vector2i): boolean
  removeOldInputConnections(editorEnv: EditorEnvironment): boolean
};

export const ConnectionEvents: ConnectionEventsType = {
  editingLine: undefined,
  startSlot: undefined,
  endSlot: undefined,
  oldStartSlot: undefined,
  oldEndSlot: undefined,
  movePoint: MovePointEnum.NONE,
  reset: function (): void {
    this.editingLine = undefined;
    this.startSlot = undefined;
    this.endSlot = undefined;
    this.oldStartSlot = undefined;
    this.oldEndSlot = undefined;
    this.movePoint = MovePointEnum.NONE;
  },
  checkConnectionClick: function (
    connections: ConnectionList,
    position: Vector2i,
  ): number[] {
    const collidedWith: Set<number> = new Set();
    for (const [key, connection] of connections.entries()) {
      const collision = connection.collisionShape.find((collisionShape) => {
        return collisionShape.collisionWithPoint(position);
      });
      if (collision !== undefined) collidedWith.add(key);
    }
    return [...collidedWith.values()];
  },
  newConnection: function (
    editorEnv: EditorEnvironment,
    slotId: number,
  ): boolean {
    if (this.editingLine !== undefined || MouseEvents.movingObject !== 'none')
      return false;
    const slot = editorEnv.slots.get(slotId);
    if (slot === undefined) return false;

    this.movePoint = slot.inSlot ? MovePointEnum.START : MovePointEnum.END;
    [this.startSlot, this.endSlot] = slot.inSlot
      ? [undefined, slot]
      : [slot, undefined];
    const editingLineId = addComponent.connection(
      undefined,
      editorEnv,
      slot.globalPosition.x,
      slot.globalPosition.y,
      slot.globalPosition.x,
      slot.globalPosition.y,
      slot.inSlot ? undefined : { nodeId: slot.parent.id, slotId: slot.id },
      slot.inSlot ? { nodeId: slot.parent.id, slotId: slot.id } : undefined,
    );
    this.editingLine = editorEnv.connections.get(editingLineId);
    MouseEvents.movingObject = 'connection';
    return true;
  },
  move: function (editorEnv: EditorEnvironment, position: Vector2i): boolean {
    if (
      !(
        MouseEvents.movingObject === 'connection'
        || MouseEvents.movingObject === 'none'
      )
      || this.editingLine === undefined
    )
      return false;

    MouseEvents.movingObject = 'connection';
    this.editingLine.move(
      position,
      false,
      this.movePoint,
      true,
      editorEnv.nodes,
    );
    return true;
  },
  setConnectionProps: function (editorEnv: EditorEnvironment): boolean {
    if (
      this.startSlot === undefined
      || this.endSlot === undefined
      || this.editingLine === undefined
    )
      return false;

    this.editingLine.position = this.startSlot.globalPosition.clone();
    this.editingLine.endPosition = this.endSlot.globalPosition.clone();
    this.editingLine.anchors = this.editingLine.generateAnchors(
      editorEnv.nodes,
    );
    this.editingLine.changeConnection(
      this.startSlot.id,
      this.startSlot.parent.id,
      false,
    );
    this.editingLine.changeConnection(
      this.endSlot.id,
      this.endSlot.parent.id,
      true,
    );
    this.startSlot.slotConnections.push(this.editingLine);
    this.endSlot.slotConnections.push(this.editingLine);
    SignalEvents.edge.add(
      editorEnv.signalGraph,
      this.editingLine,
      this.startSlot,
      this.endSlot,
    );

    this.reset();
    return true;
  },
  isValidPosition: function (
    editorEnv: EditorEnvironment,
    position: Vector2i,
  ): boolean {
    const slotCollisions = slotEvents.checkSlotClick(editorEnv.slots, position);
    if (slotCollisions.length === 0) return false;
    if (
      (this.movePoint === MovePointEnum.START
        && slotCollisions[0] === this.endSlot?.id)
      || (this.movePoint === MovePointEnum.END
        && slotCollisions[0] === this.startSlot?.id)
    )
      return false;

    const slot = editorEnv.slots.get(slotCollisions[0]);
    if (slot === undefined) return false;

    if (this.movePoint === MovePointEnum.START) {
      if (this.endSlot === undefined || slot.inSlot === this.endSlot.inSlot)
        return false;
      this.startSlot = slot;
    }
    if (this.movePoint === MovePointEnum.END) {
      if (this.startSlot === undefined || slot.inSlot === this.startSlot.inSlot)
        return false;
      this.endSlot = slot;
    }
    return true;
  },
  bindLine: function (
    editorEnv: EditorEnvironment,
    position: Vector2i,
  ): boolean {
    if (this.editingLine === undefined) return false;
    if (
      !this.isValidPosition(editorEnv, position)
      || this.startSlot === undefined
      || this.endSlot === undefined
    ) {
      removeComponent.connection(editorEnv, this.editingLine.id);
      return false;
    }

    return (
      this.removeOldInputConnections(editorEnv)
      && this.setConnectionProps(editorEnv)
    );
  },
  removeOldInputConnections: function (editorEnv: EditorEnvironment): boolean {
    if (
      this.startSlot === undefined
      || this.endSlot === undefined
      || this.editingLine === undefined
      || !this.endSlot.inSlot
    )
      return false;

    for (const connection of this.endSlot.slotConnections) {
      if (connection.id === this.editingLine.id) continue;
      removeComponent.connection(editorEnv, connection.id);
    }
    return true;
  },
};
