import ConnectionComponent from '@connectlab-editor/components/ConnectionComponent';
import {NodeTypes, SignalGraph, slotStates} from '@connectlab-editor/types';
import signalUpdate from '@connectlab-editor/signal/signalUpdate';

export default {
  addVertex(
    signalGraph: SignalGraph,
    nodeId: number,
    nodeType: NodeTypes,
    state: slotStates,
    signalFrom: Array<number> = [],
    signalTo: Array<number> = []
  ): void {
    if (!signalGraph[nodeId]) {
      signalGraph[nodeId] = {state, signalFrom, signalTo, nodeType};
      signalUpdate.updateGraph(signalGraph);
    }
  },
  removeVertex(signalGraph: SignalGraph, nodeId: number): void {
    if (signalGraph[nodeId]) {
      for (const signalToId of Object.values(signalGraph[nodeId].signalTo)) {
        const index = signalGraph[signalToId]?.signalFrom.indexOf(nodeId) ?? -1;
        if (index !== -1) {
          signalGraph[signalToId].signalFrom.splice(index, 1);
          signalGraph[signalToId].state = undefined;
        }
      }
      delete signalGraph[nodeId];
      signalUpdate.updateGraph(signalGraph);
    }
  },
  addEdge(signalGraph: SignalGraph, connection: ConnectionComponent): void {
    const startNodeId = connection.connectedTo.start?.nodeId ?? -1;
    const endNodeId = connection.connectedTo.end?.nodeId ?? -1;

    if (signalGraph[startNodeId]) {
      if (
        signalGraph[startNodeId].signalTo.find(el => endNodeId === el) ===
        undefined
      )
        signalGraph[startNodeId].signalTo.push(endNodeId);
    } else {
      console.warn(
        `Node inicial com ID ${endNodeId} não encontrado no grafo de sinal, isso poderá acarretar em bugs`,
        connection
      );
    }
    if (signalGraph[endNodeId]) {
      signalGraph[endNodeId].signalFrom.push(startNodeId);
    } else {
      console.warn(
        `Node final com ID ${endNodeId} não encontrado no grafo de sinal, isso poderá acarretar em bugs`,
        connection
      );
    }
    signalUpdate.updateGraph(signalGraph);
  },
  removeEdge(
    signalGraph: SignalGraph,
    connection: ConnectionComponent | undefined
  ): void {
    if (connection === undefined) return;
    const startNodeId = connection.connectedTo.start?.nodeId ?? -1;
    const endNodeId = connection.connectedTo.end?.nodeId ?? -1;
    if (endNodeId !== -1) {
      const indexSF =
        signalGraph[endNodeId]?.signalFrom.indexOf(startNodeId) ?? -1;
      if (indexSF !== -1) signalGraph[endNodeId].signalFrom.splice(indexSF, 1);
    }
    if (startNodeId !== -1) {
      const indexST =
        signalGraph[startNodeId]?.signalTo.indexOf(endNodeId) ?? -1;
      if (indexST !== -1) signalGraph[startNodeId].signalTo.splice(indexST, 1);
    }
    signalUpdate.updateGraph(signalGraph);
  },
  getVertexState(signalGraph: SignalGraph, nodeId: number): slotStates {
    return signalGraph[nodeId]?.state ?? false;
  },
  setVertexState(
    signalGraph: SignalGraph,
    nodeId: number,
    state: slotStates
  ): void {
    if (signalGraph[nodeId]) {
      signalGraph[nodeId].state = state;
    }
  },
  getVertexConnections(
    signalGraph: SignalGraph,
    nodeId: number
  ): Array<number> {
    return signalGraph[nodeId]?.signalFrom ?? [];
  },
};
