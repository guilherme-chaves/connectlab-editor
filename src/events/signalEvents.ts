import ConnectionComponent from '@connectlab-editor/components/connectionComponent';
import {SignalGraph, slotStates} from '@connectlab-editor/types/common';
import {NodeTypes} from '@connectlab-editor/types/enums';
import signalUpdate from '@connectlab-editor/signal/signalUpdate';

export default {
  vertex: {
    add(
      signalGraph: SignalGraph,
      nodeId: number,
      nodeType: NodeTypes,
      state: slotStates,
      signalFrom: Array<number> = [],
      signalTo: Array<number> = []
    ): void {
      if (!signalGraph[nodeId]) {
        signalGraph[nodeId] = {state, signalFrom, signalTo, nodeType};
        // Como um vértice nunca é gerado conectado, não é necessário fazer atualização de estado do grafo aqui
      }
    },
    remove(signalGraph: SignalGraph, nodeId: number): void {
      if (signalGraph[nodeId]) {
        for (const signalToId of Object.values(signalGraph[nodeId].signalTo)) {
          if (signalGraph[signalToId] === undefined) continue;
          signalGraph[signalToId].signalFrom = signalGraph[
            signalToId
          ].signalFrom.filter(val => val !== nodeId);
          signalUpdate.updateGraph(signalGraph, signalToId);
        }
        delete signalGraph[nodeId];
      }
    },
    getState(signalGraph: SignalGraph, nodeId: number): slotStates {
      return signalGraph[nodeId]?.state ?? false;
    },
    setState(
      signalGraph: SignalGraph,
      nodeId: number,
      state: slotStates
    ): void {
      if (signalGraph[nodeId]) {
        signalGraph[nodeId].state = state;
      }
    },
  },
  edge: {
    add(signalGraph: SignalGraph, connection: ConnectionComponent): void {
      const startNodeId = connection.connectedTo.start?.nodeId ?? -1;
      const endNodeId = connection.connectedTo.end?.nodeId ?? -1;

      if (
        signalGraph[startNodeId] !== undefined &&
        signalGraph[startNodeId].signalTo.find(el => endNodeId === el) ===
          undefined
      ) {
        signalGraph[startNodeId].signalTo.push(endNodeId);
      } else {
        console.warn(
          `Node inicial com ID ${endNodeId} não encontrado no grafo de sinal, isso poderá acarretar em bugs`,
          connection
        );
      }
      if (signalGraph[endNodeId] !== undefined) {
        signalGraph[endNodeId].signalFrom.push(startNodeId);
      } else {
        console.warn(
          `Node final com ID ${endNodeId} não encontrado no grafo de sinal, isso poderá acarretar em bugs`,
          connection
        );
      }
      signalUpdate.updateGraph(signalGraph, startNodeId);
    },
    remove(
      signalGraph: SignalGraph,
      connection: ConnectionComponent | undefined
    ): void {
      if (connection === undefined) return;
      const startNodeId = connection.connectedTo.start?.nodeId ?? -1;
      const endNodeId = connection.connectedTo.end?.nodeId ?? -1;
      if (endNodeId !== -1) {
        const indexSF =
          signalGraph[endNodeId]?.signalFrom.indexOf(startNodeId) ?? -1;
        if (indexSF !== -1)
          signalGraph[endNodeId].signalFrom.splice(indexSF, 1);
      }
      if (startNodeId !== -1) {
        const indexST =
          signalGraph[startNodeId]?.signalTo.indexOf(endNodeId) ?? -1;
        if (indexST !== -1)
          signalGraph[startNodeId].signalTo.splice(indexST, 1);
      }

      if (endNodeId !== -1) signalUpdate.updateGraph(signalGraph, endNodeId);
      if (startNodeId !== -1)
        signalUpdate.updateGraph(signalGraph, startNodeId);
    },
  },
};
