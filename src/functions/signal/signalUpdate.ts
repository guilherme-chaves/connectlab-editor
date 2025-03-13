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
        if (
          signalGraph[stack[0]].nodeType < 100 ||
          signalGraph[stack[0]].nodeType >= 200
        )
          this.computeState(signalGraph, signalGraph[stack[0]]);
        stack.push(...(signalGraph[stack[0]]?.signalTo ?? []));
      }
      visited.add(stack[0]);
      stack.shift();
    }
  },
  computeState(signalGraph: SignalGraph, node: SignalGraphData): void {
    const op = this.getComputeFunction(node.nodeType);
    for (const key of Object.keys(node.signalFrom))
      node.signalFrom[parseInt(key)][1] = signalGraph[parseInt(key)]!.state;
    node.state = op(node.signalFrom);
  },
  getComputeFunction(
    type: NodeTypes
  ): (slotState: Record<number, [number, slotStates]>) => boolean {
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
