import {
  SignalGraph,
  SignalGraphData,
  signalOperation,
} from '@connectlab-editor/types/common';
import { NodeTypes } from '@connectlab-editor/types/enums';
import { signalOperations } from '@connectlab-editor/signal/signalOperations';

export default {
  updateGraph(signalGraph: SignalGraph, originId: number): void {
    const visited: Set<number> = new Set();
    const stack: Array<number> = [originId];
    let currentNode = stack.shift();
    while (currentNode !== undefined) {
      if (!visited.has(currentNode) && signalGraph[currentNode] !== undefined) {
        if (
          signalGraph[currentNode].nodeType < NodeTypes.I_SWITCH
          || signalGraph[currentNode].nodeType >= NodeTypes.O_LED_RED
        )
          this.computeState(signalGraph, signalGraph[currentNode]);
        stack.push(...signalGraph[currentNode].signalTo.values());
      }
      visited.add(currentNode);
      currentNode = stack.shift();
    }
  },
  computeState(signalGraph: SignalGraph, node: SignalGraphData): void {
    const op = this.getComputeFunction(node.nodeType);
    let bitPosition = 0;
    let inputStates = 0;
    for (const connectedNodeId of node.signalFrom.values()) {
      if (connectedNodeId >= -1) {
        const bitVal = signalGraph[connectedNodeId]?.output ? 1 : 0;
        inputStates += bitVal << bitPosition;
      }
      bitPosition++;
    }
    node.output = op(inputStates, bitPosition);
  },
  getComputeFunction(type: NodeTypes): signalOperation {
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
