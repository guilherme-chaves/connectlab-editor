import ConnectionComponent from '@connectlab-editor/components/connectionComponent';
import {SignalGraph, slotStates} from '@connectlab-editor/types/common';
import {NodeTypes} from '@connectlab-editor/types/enums';
import signalUpdate from '@connectlab-editor/signal/signalUpdate';
import SlotComponent from '@connectlab-editor/components/slotComponent';

export default {
  vertex: {
    add(
      signalGraph: SignalGraph,
      nodeId: number,
      nodeType: NodeTypes,
      state: slotStates = false,
      signalFrom: Record<number, [number, slotStates]> = {},
      signalTo: Array<number> = []
    ): void {
      if (!signalGraph[nodeId]) {
        signalGraph[nodeId] = {
          state,
          signalFrom,
          signalTo,
          nodeType,
        };
        signalUpdate.updateGraph(signalGraph, nodeId);
      }
    },
    remove(signalGraph: SignalGraph, nodeId: number): void {
      if (signalGraph[nodeId]) {
        for (const signalToId of Object.values(signalGraph[nodeId].signalTo)) {
          if (signalGraph[signalToId] === undefined) continue;
          signalGraph[signalToId].signalFrom = Object.fromEntries(
            Object.entries(signalGraph[signalToId].signalFrom).filter(
              v => parseInt(v[0]) !== nodeId
            )
          );
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
    add(
      signalGraph: SignalGraph,
      connection: ConnectionComponent,
      startSlot: SlotComponent,
      endSlot: SlotComponent
    ): void {
      const startNodeId = startSlot.parent.id;
      const endNodeId = endSlot.parent.id;

      if (signalGraph[startNodeId] !== undefined) {
        signalGraph[startNodeId].signalTo.push(endNodeId);
      } else {
        console.warn(
          `Node inicial com ID ${endNodeId} não encontrado no grafo de sinal, isso poderá acarretar em bugs`,
          connection
        );
      }
      if (signalGraph[endNodeId] !== undefined) {
        signalGraph[endNodeId].signalFrom[startNodeId] = [
          endSlot.slotIdAtParent,
          signalGraph[startNodeId].state,
        ];
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
          Object.keys(signalGraph[endNodeId]?.signalFrom)[startNodeId] ?? '-1';
        if (parseInt(indexSF) !== -1)
          delete signalGraph[endNodeId].signalFrom[parseInt(indexSF)];
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
