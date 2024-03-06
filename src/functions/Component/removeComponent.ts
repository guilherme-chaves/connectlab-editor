import EditorEnvironment from '../../EditorEnvironment';
import ConnectionComponent from '../../components/ConnectionComponent';
import ComponentType from '../../types/types';
import signalEvents from '../Signal/signalEvents';

export function removeNode(
  editorEnv: EditorEnvironment,
  componentId: number
): boolean {
  const node = editorEnv.nodes.get(componentId);
  if (node === undefined) return false;
  signalEvents.removeVertex(editorEnv, componentId);
  for (let i = 0; i < node.slotComponents.length; i++)
    editorEnv.removeComponent(node.slotComponents[i].id, ComponentType.SLOT);
  return editorEnv.nodes.delete(componentId);
}

export function removeSlot(
  editorEnv: EditorEnvironment,
  componentId: number
): boolean {
  const slot = editorEnv.slots.get(componentId);
  if (slot === undefined) return false;
  for (let i = 0; i < slot.slotConnections.length; i++)
    editorEnv.removeComponent(slot.slotConnections[i].id, ComponentType.LINE);
  return editorEnv.slots.delete(componentId);
}

export function removeConnection(
  editorEnv: EditorEnvironment,
  componentId: number
): boolean {
  const connection = editorEnv.connections.get(componentId);
  if (connection === undefined) return false;
  const slotStart = editorEnv.slots.get(connection.connectedTo.start?.id ?? -1);
  const slotEnd = editorEnv.slots.get(connection.connectedTo.end?.id ?? -1);
  if (slotStart) {
    slotStart.slotConnections.forEach(
      (value: ConnectionComponent, index: number) => {
        if (value.id === componentId)
          slotStart.slotConnections.splice(index, 1);
      }
    );
  }
  if (slotEnd) {
    slotEnd.slotConnections.forEach(
      (value: ConnectionComponent, index: number) => {
        if (value.id === componentId) slotEnd.slotConnections.splice(index, 1);
      }
    );
  }
  signalEvents.removeEdge(editorEnv, editorEnv.connections.get(componentId));
  return editorEnv.connections.delete(componentId);
}

export function removeText(
  editorEnv: EditorEnvironment,
  componentId: number
): boolean {
  return editorEnv.texts.delete(componentId);
}
