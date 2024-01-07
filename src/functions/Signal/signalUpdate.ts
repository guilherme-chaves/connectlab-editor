import Editor from '../../Editor';
import ComponentType from '../../types/types';

export default {
  updateGraph(): void {
    const visited: Map<number, boolean> = new Map();
    Editor.editorEnv.signalGraph.forEach((_node, key) => {
      this.updateVertexStatus(key, visited);
    });
    visited.clear();
  },
  updateGraphPartial(): void {},
  updateVertexStatus(nodeId: number, visited: Map<number, boolean>): void {
    if (visited.has(nodeId)) return;
    const node = Editor.editorEnv.signalGraph.get(nodeId);
    visited.set(nodeId, true);
    if (node !== undefined) {
      if (node.signalFrom.length > 0)
        for (let i = 0; i < node.signalFrom.length; i++)
          this.updateVertexStatus(node.signalFrom[i], visited);
      const nodeObj =
        Editor.editorEnv.nodes.get(nodeId) ??
        Editor.editorEnv.inputs.get(nodeId) ??
        Editor.editorEnv.outputs.get(nodeId);
      if (
        nodeObj !== undefined &&
        nodeObj.componentType !== ComponentType.INPUT
      ) {
        const op: (slotState: Array<boolean>) => boolean = nodeObj.nodeType.op;
        const slotStatus: Array<boolean> = [];
        for (let i = 0; i < node.signalFrom.length; i++)
          slotStatus.push(
            Editor.editorEnv.signalGraph.get(node.signalFrom[i])?.state ?? false
          );
        node.state = op(slotStatus);
      }
    }
  },
};
