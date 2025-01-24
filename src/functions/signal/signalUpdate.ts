import {
  SignalGraph,
  SignalGraphData,
  slotStates,
} from '@connectlab-editor/types/common';
import {NodeTypes} from '@connectlab-editor/types/enums';
import {signalOperations} from '@connectlab-editor/signal/signalOperations';

export default {
  updateGraph(signalGraph: SignalGraph, originId: number): void {
    const visited: Set<number> = new Set();
    const stack: Array<number> = [originId];
    while (stack.length > 0) {
      if (!visited.has(stack[0]) && signalGraph[stack[0]] !== undefined) {
        if (signalGraph[stack[0]].nodeType !== NodeTypes.I_SWITCH)
          this.computeState(signalGraph, signalGraph[stack[0]]);
        stack.push(...(signalGraph[stack[0]]?.signalTo ?? []));
      }
      visited.add(stack[0]);
      stack.shift();
    }
  },
  computeState(signalGraph: SignalGraph, node: SignalGraphData): void {
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
        return signalOperations.and;
      case NodeTypes.G_NAND:
        return signalOperations.nand;
      case NodeTypes.G_NOR:
        return signalOperations.nor;
      case NodeTypes.G_NOT:
        return signalOperations.not;
      case NodeTypes.G_OR:
        return signalOperations.or;
      case NodeTypes.G_XNOR:
        return signalOperations.xnor;
      case NodeTypes.G_XOR:
        return signalOperations.xor;
      default:
        return signalOperations.input_output;
    }
  },
};
