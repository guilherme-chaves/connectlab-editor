import EditorEnvironment from '../../EditorEnvironment';
import ConnectionComponent from '../../components/ConnectionComponent';
import SlotComponent from '../../components/SlotComponent';
import ComponentType, {SignalGraph} from '../../types/types';
import signalUpdate from './signalUpdate';

export default {
  addVertex(
    editorEnv: EditorEnvironment,
    nodeId: number,
    state: boolean = false,
    signalFrom: Array<number> = [],
    signalTo: Array<number> = []
  ): void {
    if (!editorEnv.signalGraph.has(nodeId)) {
      editorEnv.signalGraph.set(nodeId, {state, signalFrom, signalTo});
      signalUpdate.updateGraph(editorEnv);
    }
  },
  removeVertex(editorEnv: EditorEnvironment, nodeId: number): void {
    if (editorEnv.signalGraph.has(nodeId)) {
      editorEnv.signalGraph.get(nodeId)!.signalTo.forEach(connection => {
        if (editorEnv.signalGraph.has(connection)) {
          const index = editorEnv.signalGraph
            .get(connection)!
            .signalFrom.indexOf(nodeId);
          if (index !== -1)
            editorEnv.signalGraph.get(connection)!.signalFrom.splice(index, 1);
        }
      });
      editorEnv.signalGraph.delete(nodeId);
      signalUpdate.updateGraph(editorEnv);
    }
  },
  addEdge(editorEnv: EditorEnvironment, connection: ConnectionComponent): void {
    let startNodeId = -1;
    let endNodeId = -1;
    if (connection.connectedTo.start !== undefined) {
      const slot = editorEnv.slots.get(connection.connectedTo.start.id);
      if (slot !== undefined) startNodeId = slot.parent.id;
    }
    if (connection.connectedTo.end !== undefined) {
      const slot = editorEnv.slots.get(connection.connectedTo.end.id);
      if (slot !== undefined) endNodeId = slot.parent.id;
    }
    const startNode = editorEnv.signalGraph.get(startNodeId);
    const endNode = editorEnv.signalGraph.get(endNodeId);

    if (startNode) {
      if (startNode.signalTo.find(el => endNodeId === el) === undefined)
        startNode.signalTo.push(endNodeId);
    } else {
      this.addVertex(editorEnv, startNodeId, false, undefined, [endNodeId]);
    }
    if (endNode) {
      if (endNode.signalFrom.find(el => startNodeId === el) === undefined)
        endNode.signalFrom.push(startNodeId);
    } else {
      this.addVertex(editorEnv, endNodeId, false, [startNodeId]);
    }
    signalUpdate.updateGraphPartial(editorEnv, startNodeId);
  },
  removeEdge(
    editorEnv: EditorEnvironment,
    connection: ConnectionComponent | undefined
  ): void {
    if (connection === undefined) return;
    const startSlotId = connection.connectedTo.start?.id ?? -1;
    const endSlotId = connection.connectedTo.end?.id ?? -1;
    const startNodeId = editorEnv.slots.get(startSlotId)?.parent.id ?? -1;
    const endNodeId = editorEnv.slots.get(endSlotId)?.parent.id ?? -1;
    const startNode = editorEnv.signalGraph.get(startNodeId);
    const endNode = editorEnv.signalGraph.get(endNodeId);
    if (endNode) {
      const indexSF = endNode.signalFrom.indexOf(startNodeId);
      if (indexSF !== -1) endNode.signalFrom.splice(indexSF, 1);
    }
    if (startNode) {
      const indexST = startNode.signalTo.indexOf(endNodeId);
      if (indexST !== -1) startNode.signalTo.splice(indexST, 1);
    }
    signalUpdate.updateGraph(editorEnv);
  },
  getVertexState(signalGraph: SignalGraph, nodeId: number): boolean {
    return signalGraph.get(nodeId)?.state ?? false;
  },
  setVertexState(
    signalGraph: SignalGraph,
    nodeId: number,
    state: boolean
  ): void {
    if (signalGraph.has(nodeId)) {
      signalGraph.get(nodeId)!.state = state;
    }
  },
  getVertexConnections(
    signalGraph: SignalGraph,
    nodeId: number
  ): Array<number> {
    return signalGraph.get(nodeId)?.signalFrom ?? [];
  },
  // setVertexConnections(nodeId: number, signalFrom: Array<number>): void {

  // },
  convertToSignalFromList(
    editorEnv: EditorEnvironment,
    nodeId: number,
    componentType: ComponentType
  ): Array<number> {
    const signalFrom: Array<number> = [];
    if (!editorEnv.signalGraph.has(nodeId)) {
      let slots: Array<SlotComponent> = [];
      switch (componentType) {
        case ComponentType.INPUT:
          slots = editorEnv.inputs.get(nodeId)!.slotComponents;
          break;
        case ComponentType.NODE:
          slots = editorEnv.nodes.get(nodeId)!.slotComponents;
          break;
        case ComponentType.OUTPUT:
          slots = editorEnv.outputs.get(nodeId)!.slotComponents;
      }
      for (let i = 0; i < slots.length; i++) {
        if (slots[i].inSlot && slots[i].slotConnections.length > 0) {
          signalFrom.push(slots[i].slotConnections[0].id);
        } else {
          slots[i].slotConnections.forEach(connection =>
            signalFrom.push(connection.id)
          );
        }
      }
    }
    return signalFrom;
  },
};
