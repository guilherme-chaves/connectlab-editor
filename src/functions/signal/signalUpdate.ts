import {
  NodeTypes,
  SignalGraph,
  SignalGraphData,
  slotStates,
} from '@connectlab-editor/types';
import {
  and,
  input_output,
  nand,
  nor,
  not,
  or,
  xnor,
  xor,
} from '@connectlab-editor/signal/signalOperations';

export default {
  updateGraph(signalGraph: SignalGraph): void {
    const visited: Set<number> = new Set();
    for (const key of Object.keys(signalGraph)) {
      this.updateVertexStatus(signalGraph, parseInt(key), visited);
    }
    visited.clear();
  },
  updateGraphPartial(signalGraph: SignalGraph, nodeId: number): void {
    const visited: Set<number> = new Set();
    const stack: Array<number> = [nodeId];
    do {
      if (!visited.has(stack[0])) {
        visited.add(stack[0]);
        stack.push(...(signalGraph[stack[0]]?.signalTo ?? []));
        if (
          stack[0] !== nodeId &&
          signalGraph[stack[0]].nodeType !== NodeTypes.I_SWITCH
        ) {
          this.computeState(signalGraph, signalGraph[stack[0]]);
        }
      }
      stack.shift();
    } while (stack.length > 0);
  },
  updateVertexStatus(
    signalGraph: SignalGraph,
    nodeId: number,
    visited: Set<number>
  ): void {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    const node = signalGraph[nodeId];
    if (node === undefined) return;
    if (node.signalFrom.length < 1) return;
    for (let i = 0; i < node.signalFrom.length; i++)
      this.updateVertexStatus(signalGraph, node.signalFrom[i], visited);
    if (node.nodeType !== NodeTypes.I_SWITCH)
      this.computeState(signalGraph, node);
  },
  computeState(signalGraph: SignalGraph, node: SignalGraphData) {
    const op = this.getComputeFunction(node.nodeType);
    const slotStatus: [slotStates, slotStates] = [false, false];
    slotStatus[0] = signalGraph[node.signalFrom[0]]?.state ?? false;
    slotStatus[1] = signalGraph[node.signalFrom[1]]?.state ?? false;
    node.state = op(slotStatus);
  },
  getComputeFunction(
    type: NodeTypes
  ): (slotState: [slotStates, slotStates]) => boolean {
    switch (type) {
      case NodeTypes.G_AND:
        return and;
      case NodeTypes.G_NAND:
        return nand;
      case NodeTypes.G_NOR:
        return nor;
      case NodeTypes.G_NOT:
        return not;
      case NodeTypes.G_OR:
        return or;
      case NodeTypes.G_XNOR:
        return xnor;
      case NodeTypes.G_XOR:
        return xor;
      default:
        return input_output;
    }
  },
};
