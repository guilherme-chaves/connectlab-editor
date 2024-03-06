import EditorEnvironment from '../../EditorEnvironment';
import Node from '../../interfaces/nodeInterface';
import ComponentType, {
  SignalGraph,
  SignalGraphData,
  slotStates,
} from '../../types/types';

export default {
  updateGraph(editorEnv: EditorEnvironment): void {
    const visited: Set<number> = new Set();
    editorEnv.signalGraph.forEach((_node, key) => {
      this.updateVertexStatus(editorEnv, key, visited);
    });
    visited.clear();
  },
  updateGraphPartial(editorEnv: EditorEnvironment, nodeId: number): void {
    const visited: Set<number> = new Set();
    const stack: Array<number> = [nodeId];
    do {
      if (!visited.has(stack[0])) {
        visited.add(stack[0]);
        const nodeObj = editorEnv.nodes.get(stack[0]);
        if (nodeObj !== undefined) {
          stack.push(...(editorEnv.signalGraph.get(stack[0])?.signalTo ?? []));
          if (
            stack[0] !== nodeId &&
            nodeObj.componentType !== ComponentType.INPUT
          ) {
            this.computeState(
              editorEnv.signalGraph,
              editorEnv.signalGraph.get(stack[0])!,
              nodeObj
            );
          }
        }
      }
      stack.shift();
    } while (stack.length > 0);
  },
  updateVertexStatus(
    editorEnv: EditorEnvironment,
    nodeId: number,
    visited: Set<number>
  ): void {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    const node = editorEnv.signalGraph.get(nodeId);
    if (node === undefined) return;
    if (node.signalFrom.length < 1) return;
    for (let i = 0; i < node.signalFrom.length; i++)
      this.updateVertexStatus(editorEnv, node.signalFrom[i], visited);
    const nodeObj = editorEnv.nodes.get(nodeId);
    if (nodeObj !== undefined && nodeObj.componentType !== ComponentType.INPUT)
      this.computeState(editorEnv.signalGraph, node, nodeObj);
  },
  computeState(signalGraph: SignalGraph, node: SignalGraphData, nodeObj: Node) {
    const op = nodeObj.nodeType.op;
    const slotStatus: [slotStates, slotStates] = [undefined, undefined];
    slotStatus[0] = signalGraph.get(node.signalFrom[0])?.state;
    slotStatus[1] = signalGraph.get(node.signalFrom[1])?.state;
    node.state = op(slotStatus);
  },
};
