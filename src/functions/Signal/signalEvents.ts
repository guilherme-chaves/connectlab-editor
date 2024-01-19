import EditorEnvironment from '../../EditorEnvironment';
import ConnectionComponent from '../../components/ConnectionComponent';
import SlotComponent from '../../components/SlotComponent';
import ComponentType, {SignalGraph} from '../../types/types';
import signalUpdate from './signalUpdate';

export default {
  addVertex(
    signalGraph: SignalGraph,
    nodeId: number,
    state: boolean = false,
    signalFrom: Array<number> = [],
    signalTo: Array<number> = []
  ): void {
    if (!signalGraph.has(nodeId)) {
      signalGraph.set(nodeId, {state, signalFrom, signalTo});
      signalUpdate.updateGraph();
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
      signalUpdate.updateGraph();
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

    if (editorEnv.signalGraph.has(startNodeId)) {
      if (
        editorEnv.signalGraph
          .get(startNodeId)!
          .signalTo.find(el => endNodeId === el) === undefined
      )
        editorEnv.signalGraph.get(startNodeId)!.signalTo.push(endNodeId);
    } else {
      this.addVertex(editorEnv.signalGraph, startNodeId, false, undefined, [
        endNodeId,
      ]);
    }
    if (editorEnv.signalGraph.has(endNodeId)) {
      if (
        editorEnv.signalGraph
          .get(endNodeId)!
          .signalFrom.find(el => startNodeId === el) === undefined
      )
        return;
      editorEnv.signalGraph.get(endNodeId)!.signalFrom.push(startNodeId);
    } else {
      this.addVertex(editorEnv.signalGraph, endNodeId, false, [startNodeId]);
    }
    signalUpdate.updateGraph();
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
    if (endNodeId !== -1) {
      const indexSF = editorEnv.signalGraph
        .get(endNodeId)!
        .signalFrom.indexOf(startNodeId);
      if (indexSF !== -1)
        editorEnv.signalGraph.get(endNodeId)!.signalFrom.splice(indexSF, 1);
    }
    if (startNodeId !== -1) {
      const indexST = editorEnv.signalGraph
        .get(startNodeId)!
        .signalTo.indexOf(endNodeId);
      if (indexST !== -1)
        editorEnv.signalGraph.get(startNodeId)!.signalTo.splice(indexST, 1);
    }
    signalUpdate.updateGraph();
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
      signalUpdate.updateGraphPartial(nodeId);
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
          slots = editorEnv.nodes.get(nodeId)?.slotComponents ?? [];
          break;
        case ComponentType.OUTPUT:
          slots = editorEnv.inputs.get(nodeId)!.slotComponents;
      }
      for (let i = 0; i < slots.length; i++) {
        if (slots[i].inSlot) {
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
