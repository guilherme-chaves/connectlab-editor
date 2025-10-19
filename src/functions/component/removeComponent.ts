import EditorEnvironment from '@connectlab-editor/environment';
import { ComponentType } from '@connectlab-editor/types/enums';
import signalEvents from '@connectlab-editor/events/signalEvents';

const removeComponent = {
  node(editorEnv: EditorEnvironment, componentId: number): boolean {
    const node = editorEnv.nodes.get(componentId);
    if (node === undefined) return false;
    for (let i = 0; i < node.slots.length; i++)
      editorEnv.removeComponent(node.slots[i].id, ComponentType.SLOT);
    signalEvents.vertex.remove(editorEnv.signalGraph, componentId);
    return editorEnv.nodes.delete(componentId);
  },
  slot(editorEnv: EditorEnvironment, componentId: number): boolean {
    const slot = editorEnv.slots.get(componentId);
    if (slot === undefined) return false;
    for (const connection of Object.values(slot.slotConnections))
      editorEnv.removeComponent(connection.id, ComponentType.LINE);
    return editorEnv.slots.delete(componentId);
  },
  connection(editorEnv: EditorEnvironment, componentId: number): boolean {
    const connection = editorEnv.connections.get(componentId);
    if (connection === undefined) return false;
    const slotStart = editorEnv.slots.get(
      connection.connectedTo.start?.slotId ?? -1,
    );
    const slotEnd = editorEnv.slots.get(
      connection.connectedTo.end?.slotId ?? -1,
    );
    if (slotStart) {
      const index = slotStart.slotConnections.findIndex(
        value => value.id === componentId,
      );
      if (index !== -1) slotStart.slotConnections.splice(index, 1);
    }
    if (slotEnd) {
      const index = slotEnd.slotConnections.findIndex(
        value => value.id === componentId,
      );
      if (index !== -1) slotEnd.slotConnections.splice(index, 1);
    }
    signalEvents.edge.remove(editorEnv.signalGraph, connection);
    return editorEnv.connections.delete(componentId);
  },
  text(editorEnv: EditorEnvironment, componentId: number): boolean {
    return editorEnv.texts.delete(componentId);
  },
};

export default removeComponent;
