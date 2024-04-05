import EditorEnvironment from '../../EditorEnvironment';
import {ComponentType} from '../../types/types';
import signalEvents from '../Signal/signalEvents';

export function removeNode(
  editorEnv: EditorEnvironment,
  componentId: number
): boolean {
  const node = editorEnv.nodes.get(componentId);
  if (node === undefined) return false;
  signalEvents.removeVertex(editorEnv.signalGraph, componentId);
  for (const slot of Object.values(node.slotComponents))
    editorEnv.removeComponent(slot.id, ComponentType.SLOT);
  return editorEnv.nodes.delete(componentId);
}

export function removeSlot(
  editorEnv: EditorEnvironment,
  componentId: number
): boolean {
  const slot = editorEnv.slots.get(componentId);
  if (slot === undefined) return false;
  for (const connection of Object.values(slot.slotConnections))
    editorEnv.removeComponent(connection.id, ComponentType.LINE);
  return editorEnv.slots.delete(componentId);
}

export function removeConnection(
  editorEnv: EditorEnvironment,
  componentId: number
): boolean {
  const connection = editorEnv.connections.get(componentId);
  if (connection === undefined) return false;
  const slotStart = editorEnv.slots.get(
    connection.connectedTo.start?.slotId ?? -1
  );
  const slotEnd = editorEnv.slots.get(connection.connectedTo.end?.slotId ?? -1);
  if (slotStart) {
    const index = slotStart.slotConnections.findIndex(
      value => value.id === componentId
    );
    if (index !== -1) slotStart.slotConnections.splice(index, 1);
  }
  if (slotEnd) {
    const index = slotEnd.slotConnections.findIndex(
      value => value.id === componentId
    );
    if (index !== -1) slotEnd.slotConnections.splice(index, 1);
  }
  signalEvents.removeEdge(editorEnv.signalGraph, connection);
  return editorEnv.connections.delete(componentId);
}

export function removeText(
  editorEnv: EditorEnvironment,
  componentId: number
): boolean {
  return editorEnv.texts.delete(componentId);
}
