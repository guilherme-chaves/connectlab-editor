import ConnectionComponent from '@connectlab-editor/components/connectionComponent';
import {
  SignalGraph,
  NodeModel,
} from '@connectlab-editor/types/common';
import { NodeTypes } from '@connectlab-editor/types/enums';
import signalUpdate from '@connectlab-editor/signal/signalUpdate';
import SlotComponent from '@connectlab-editor/components/slotComponent';

export default {
  vertex: {
    add(
      signalGraph: SignalGraph,
      nodeId: number,
      nodeType: NodeTypes,
      nodeModel: NodeModel,
      output = false,
      signalFrom: Map<number, number> = new Map(),
      signalTo: Set<number> = new Set(),
    ): void {
      if (signalGraph[nodeId] === undefined) {
        if (signalFrom.size === 0) {
          for (const slot of Object.values(nodeModel.connectionSlot)) {
            if (!slot.in) continue;
            signalFrom.set(slot.id, -1);
          }
        }
        signalGraph[nodeId] = {
          id: nodeId,
          output,
          signalFrom,
          signalTo,
          nodeType,
          signalGraph,
        };
        signalUpdate.updateGraph(signalGraph, nodeId);
      }
    },
    remove(signalGraph: SignalGraph, nodeId: number): void {
      const node = signalGraph[nodeId];
      if (node === undefined) {
        console.warn(
          `Node ${nodeId} não encontrado no grafo de sinal lógico ao ser removido!`,
        );
        return;
      }
      for (const signalToId of node.signalTo.values()) {
        if (signalGraph[signalToId] === undefined) continue;
        signalGraph[signalToId].signalFrom.forEach((v, k, m) => {
          if (v === nodeId) {
            m.set(k, -1);
          }
        });
      }
      delete signalGraph[nodeId];
    },
    getState(signalGraph: SignalGraph, nodeId: number): boolean {
      return signalGraph[nodeId].output ?? false;
    },
    setState(signalGraph: SignalGraph, nodeId: number, state: boolean): void {
      if (signalGraph[nodeId]) {
        signalGraph[nodeId].output = state;
      }
    },
  },
  edge: {
    add(
      signalGraph: SignalGraph,
      connection: ConnectionComponent,
      startSlot: SlotComponent,
      endSlot: SlotComponent,
    ): void {
      const startNodeId = startSlot.parent.id;
      const endNodeId = endSlot.parent.id;

      if (signalGraph[startNodeId] !== undefined) {
        signalGraph[startNodeId].signalTo.add(endNodeId);
      }
      else {
        console.warn(
          `Node inicial com ID ${endNodeId} não encontrado no grafo de sinal, isso poderá acarretar em bugs`,
          connection,
        );
      }
      if (signalGraph[endNodeId] !== undefined) {
        signalGraph[endNodeId].signalFrom.set(
          endSlot.slotIdAtParent,
          startNodeId,
        );
      }
      else {
        console.warn(
          `Node final com ID ${endNodeId} não encontrado no grafo de sinal, isso poderá acarretar em bugs`,
          connection,
        );
      }
      signalUpdate.updateGraph(signalGraph, startNodeId);
    },
    remove(
      signalGraph: SignalGraph,
      connection: ConnectionComponent | undefined,
    ): void {
      if (connection === undefined) return;
      const startNodeId = connection.connectedTo.start?.nodeId ?? -1;
      const endNodeId = connection.connectedTo.end?.nodeId ?? -1;
      if (endNodeId >= 0 && signalGraph[endNodeId] !== undefined) {
        signalGraph[endNodeId].signalFrom.forEach((v, k, m) => {
          if (v === startNodeId) m.set(k, -1);
        });
      }
      if (startNodeId >= 0 && signalGraph[startNodeId] !== undefined) {
        signalGraph[startNodeId].signalTo.delete(
          connection.connectedTo.end?.nodeId ?? -1,
        );
      }
      if (endNodeId !== -1) signalUpdate.updateGraph(signalGraph, endNodeId);
    },
  },
};
