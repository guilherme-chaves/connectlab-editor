import Editor from '../../Editor';
import InputComponent from '../../components/InputComponent';
import NodeComponent from '../../components/NodeComponent';
import OutputComponent from '../../components/OutputComponent';
import ComponentType, {SignalGraphData} from '../../types/types';

export default {
  updateGraph(): void {
    const visited: Map<number, boolean> = new Map();
    Editor.editorEnv.signalGraph.forEach((_node, key) => {
      this.updateVertexStatus(key, visited);
    });
    visited.clear();
  },
  updateGraphPartial(nodeId: number): void {
    const visited: Set<number> = new Set();
    const stack: Array<number> = [nodeId];
    do {
      if (!visited.has(stack[0])) {
        visited.add(stack[0]);
        const nodeObj = this.getNodeObject(stack[0]);
        if (nodeObj !== undefined) {
          stack.push(...Editor.editorEnv.signalGraph.get(stack[0])!.signalTo);
          if (
            stack[0] !== nodeId &&
            nodeObj.componentType !== ComponentType.INPUT
          ) {
            this.computeState(
              Editor.editorEnv.signalGraph.get(stack[0])!,
              nodeObj
            );
          }
        }
      }
      stack.shift();
    } while (stack.length > 0);
  },
  updateVertexStatus(nodeId: number, visited: Map<number, boolean>): void {
    if (visited.has(nodeId)) return;
    const node = Editor.editorEnv.signalGraph.get(nodeId);
    visited.set(nodeId, true);
    if (node === undefined) return;
    if (node.signalFrom.length < 1) return;
    for (let i = 0; i < node.signalFrom.length; i++)
      this.updateVertexStatus(node.signalFrom[i], visited);
    const nodeObj = this.getNodeObject(nodeId);
    if (nodeObj !== undefined && nodeObj.componentType !== ComponentType.INPUT)
      this.computeState(node, nodeObj);
  },
  getNodeObject(
    nodeId: number
  ): NodeComponent | InputComponent | OutputComponent | undefined {
    return (
      Editor.editorEnv.nodes.get(nodeId) ??
      Editor.editorEnv.inputs.get(nodeId) ??
      Editor.editorEnv.outputs.get(nodeId)
    );
  },
  computeState(
    node: SignalGraphData,
    nodeObj: NodeComponent | InputComponent | OutputComponent
  ) {
    const op: (slotState: Array<boolean>) => boolean = nodeObj.nodeType.op;
    const slotStatus: Array<boolean> = [];
    for (let i = 0; i < node.signalFrom.length; i++)
      slotStatus.push(
        Editor.editorEnv.signalGraph.get(node.signalFrom[i])?.state ?? false
      );
    node.state = op(slotStatus);
  },
};
