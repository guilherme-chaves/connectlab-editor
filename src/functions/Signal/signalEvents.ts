import Editor from '../../Editor';
import ConnectionComponent from '../../components/ConnectionComponent';
import SlotComponent from '../../components/SlotComponent';
import ComponentType from '../../types/types';
// import signalUpdate from './signalUpdate';

export default {
  addVertex(
    nodeId: number,
    state: boolean = false,
    signalFrom: Array<number> = []
  ): void {
    if (!Editor.editorEnv.signalGraph.has(nodeId)) {
      Editor.editorEnv.signalGraph.set(nodeId, {state, signalFrom});
      // signalUpdate.updateGraph();
    }
  },
  removeVertex(nodeId: number, componentType: ComponentType): void {
    if (Editor.editorEnv.signalGraph.has(nodeId)) {
      let slots: Array<SlotComponent> = [];
      switch (componentType) {
        case ComponentType.INPUT:
          slots =
            Editor.editorEnv.inputs.get(nodeId)!.slotComponent === undefined
              ? []
              : [Editor.editorEnv.inputs.get(nodeId)!.slotComponent!];
          break;
        case ComponentType.NODE:
          slots = Editor.editorEnv.nodes.get(nodeId)!.slotComponents;
          break;
        case ComponentType.OUTPUT:
          slots =
            Editor.editorEnv.inputs.get(nodeId)!.slotComponent === undefined
              ? []
              : [Editor.editorEnv.inputs.get(nodeId)!.slotComponent!];
      }
      for (let i = 0; i < slots.length; i++) {
        if (slots[i].inSlot) {
          this.removeEdge(slots[i].slotConnections[0]);
        } else {
          slots[i].slotConnections.forEach(connection =>
            this.removeEdge(connection)
          );
        }
      }
      Editor.editorEnv.signalGraph.delete(nodeId);
      // signalUpdate.updateGraph();
    }
  },
  addEdge(connection: ConnectionComponent): void {
    let startNodeId = -1;
    let endNodeId = -1;
    if (connection.connectedTo.start !== undefined) {
      const slot = Editor.editorEnv.slots.get(connection.connectedTo.start.id);
      if (slot !== undefined) startNodeId = slot.parent.id;
    }
    if (connection.connectedTo.end !== undefined) {
      const slot = Editor.editorEnv.slots.get(connection.connectedTo.end.id);
      if (slot !== undefined) endNodeId = slot.parent.id;
    }
    if (Editor.editorEnv.signalGraph.has(endNodeId)) {
      if (
        Editor.editorEnv.signalGraph
          .get(endNodeId)!
          .signalFrom.find(el => startNodeId === el) !== undefined
      )
        return;
      Editor.editorEnv.signalGraph.get(endNodeId)!.signalFrom.push(startNodeId);
    } else {
      this.addVertex(endNodeId, false, [startNodeId]);
    }
    // signalUpdate.updateGraph();
  },
  removeEdge(connection: ConnectionComponent | undefined): void {
    if (connection === undefined) return;
    const startSlotId = connection.connectedTo.start?.id ?? -1;
    const endSlotId = connection.connectedTo.end?.id ?? -1;
    const startNodeId =
      Editor.editorEnv.slots.get(startSlotId)?.parent.id ?? -1;
    const endNode = Editor.editorEnv.slots.get(endSlotId)?.parent;
    if (endNode !== undefined) {
      const index = Editor.editorEnv.signalGraph
        .get(endNode.id)!
        .signalFrom.indexOf(startNodeId);
      if (index !== -1)
        Editor.editorEnv.signalGraph
          .get(endNode.id)!
          .signalFrom.splice(index, 1);
    }
    // signalUpdate.updateGraph();
  },
  getVertexState(nodeId: number): boolean {
    return Editor.editorEnv.signalGraph.get(nodeId)?.state ?? false;
  },
  setVertexState(nodeId: number, state: boolean): void {
    if (Editor.editorEnv.signalGraph.has(nodeId)) {
      Editor.editorEnv.signalGraph.get(nodeId)!.state = state;
      // signalUpdate.updateGraphPartial();
    }
  },
  getVertexConnections(nodeId: number): Array<number> {
    return Editor.editorEnv.signalGraph.get(nodeId)?.signalFrom ?? [];
  },
  // setVertexConnections(nodeId: number, signalFrom: Array<number>): void {

  // },
  convertToSignalFromList(
    nodeId: number,
    componentType: ComponentType
  ): Array<number> {
    const signalFrom: Array<number> = [];
    if (!Editor.editorEnv.signalGraph.has(nodeId)) {
      let slots: Array<SlotComponent> = [];
      switch (componentType) {
        case ComponentType.INPUT:
          slots =
            Editor.editorEnv.inputs.get(nodeId)!.slotComponent === undefined
              ? []
              : [Editor.editorEnv.inputs.get(nodeId)!.slotComponent!];
          break;
        case ComponentType.NODE:
          slots = Editor.editorEnv.nodes.get(nodeId)!.slotComponents;
          break;
        case ComponentType.OUTPUT:
          slots =
            Editor.editorEnv.inputs.get(nodeId)!.slotComponent === undefined
              ? []
              : [Editor.editorEnv.inputs.get(nodeId)!.slotComponent!];
      }
      for (let i = 0; i < slots.length; i++) {
        if (slots[i].inSlot) {
          signalFrom.push(slots[i].slotConnections[0].id);
        } else {
          slots[i].slotConnections.forEach(connection =>
            signalFrom.push(connection.id)
          );
        }
      }
    }
    return signalFrom;
  },
};
