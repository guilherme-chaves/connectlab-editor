import EditorEnvironment from '@connectlab-editor/environment';
import ConnectionComponent from '@connectlab-editor/components/connectionComponent';
import NodeInterface from '@connectlab-editor/interfaces/nodeInterface';
import GateNode from '@connectlab-editor/components/nodes/defaultGate';
import SlotComponent from '@connectlab-editor/components/slotComponent';
import TextComponent from '@connectlab-editor/components/textComponent';
import Component from '@connectlab-editor/interfaces/componentInterface';
import Vector2 from '@connectlab-editor/types/vector2';
import {ConnectionVertex, NodeModel} from '@connectlab-editor/types/common';
import {ComponentType, NodeTypes} from '@connectlab-editor/types/enums';
import signalEvents from '@connectlab-editor/events/signalEvents';
import SwitchInput from '@connectlab-editor/components/nodes/switchInput';
import {SwitchInput as SwitchInputModel} from '@connectlab-editor/models/input';
import LedOutput from '@connectlab-editor/components/nodes/ledOutput';
import {
  LEDROutput,
  SegmentsOutput as SegmentsOutputModel,
} from '@connectlab-editor/models/output';
import SegmentsOutput from '@connectlab-editor/components/nodes/segmentsOutput';

const addComponent = {
  node(
    id: number = -1,
    editorEnv: EditorEnvironment,
    canvasWidth: number,
    canvasHeight: number,
    type: NodeTypes,
    x: number,
    y: number,
    slotIds: number[] = [],
    shiftPosition = true,
    state: boolean = false
  ): number {
    const definedId = id >= 0 ? id : editorEnv.nextComponentId;

    let newNode: NodeInterface;
    switch (type) {
      case NodeTypes.G_AND:
      case NodeTypes.G_NAND:
      case NodeTypes.G_NOR:
      case NodeTypes.G_NOT:
      case NodeTypes.G_OR:
      case NodeTypes.G_XNOR:
      case NodeTypes.G_XOR:
        signalEvents.vertex.add(editorEnv.signalGraph, definedId, type, state);

        newNode = new GateNode(
          definedId,
          new Vector2(x, y),
          ComponentType.NODE,
          type,
          canvasWidth,
          canvasHeight,
          [],
          editorEnv.nodeImageList,
          editorEnv.signalGraph,
          shiftPosition
        );
        break;
      default:
        console.error(
          'O tipo de node passado como parâmetro é inválido!',
          type
        );
        return -1;
    }

    editorEnv.nodes.set(definedId, newNode);
    const node = editorEnv.nodes.get(definedId)!;
    editorEnv.updateComponentId(id >= 0 ? id : undefined);

    if (slotIds.length === 0) {
      const slotParams = GateNode.getNodeModel(type).connectionSlot;
      for (const slot of Object.values(slotParams)) {
        const slotKey = this.slot(
          undefined,
          editorEnv,
          slot.localPos.x,
          slot.localPos.y,
          node,
          slot.in
        );
        if (!node.slots.find(slot => slot.id === slotKey)) {
          const slot = editorEnv.slots.get(slotKey);
          if (slot) node.slots.push(slot);
        }
      }
    } else {
      for (const slotId of slotIds) {
        const slot = editorEnv.slots.get(slotId);
        if (slot) node.slots.push(slot);
      }
    }

    return definedId;
  },

  input(
    id: number = -1,
    editorEnv: EditorEnvironment,
    canvasWidth: number,
    canvasHeight: number,
    type: NodeTypes,
    x: number,
    y: number,
    slotIds: number[] = [],
    shiftPosition = true,
    state: boolean = false
  ): number {
    const definedId = id >= 0 ? id : editorEnv.nextComponentId;
    let newInput: NodeInterface;
    let model: NodeModel;
    switch (type) {
      case NodeTypes.I_SWITCH:
        signalEvents.vertex.add(editorEnv.signalGraph, definedId, type, state);
        newInput = new SwitchInput(
          definedId,
          new Vector2(x, y),
          ComponentType.INPUT,
          canvasWidth,
          canvasHeight,
          [],
          editorEnv.nodeImageList,
          editorEnv.signalGraph,
          shiftPosition
        );
        model = SwitchInputModel;
        break;
      default:
        console.error(
          'O tipo de node de entrada passado como parâmetro é inválido!',
          type
        );
        return -1;
    }

    editorEnv.nodes.set(definedId, newInput);
    const input = editorEnv.nodes.get(definedId)!;
    editorEnv.updateComponentId(id >= 0 ? id : undefined);

    if (slotIds.length === 0) {
      const slotParams = model.connectionSlot;
      for (const slot of Object.values(slotParams)) {
        const slotKey = this.slot(
          undefined,
          editorEnv,
          slot.localPos.x,
          slot.localPos.y,
          input,
          slot.in
        );
        if (!input.slots.find(slot => slot.id === slotKey)) {
          const slot = editorEnv.slots.get(slotKey);
          if (slot) input.slots.push(slot);
        }
      }
    } else {
      for (const slotId of slotIds) {
        const slot = editorEnv.slots.get(slotId);
        if (slot) input.slots.push(slot);
      }
    }

    return definedId;
  },

  output(
    id: number = -1,
    editorEnv: EditorEnvironment,
    canvasWidth: number,
    canvasHeight: number,
    type: NodeTypes,
    x: number,
    y: number,
    slotIds: number[] = [],
    shiftPosition = true,
    state: boolean = false
  ): number {
    const definedId = id >= 0 ? id : editorEnv.nextComponentId;
    let newOutput: NodeInterface;
    let model: NodeModel;
    switch (type) {
      case NodeTypes.O_LED_RED:
        signalEvents.vertex.add(editorEnv.signalGraph, definedId, type, state);
        newOutput = new LedOutput(
          definedId,
          new Vector2(x, y),
          ComponentType.INPUT,
          canvasWidth,
          canvasHeight,
          [],
          editorEnv.nodeImageList,
          editorEnv.signalGraph,
          shiftPosition
        );
        model = LEDROutput;
        break;
      case NodeTypes.O_7_SEGMENTS:
        signalEvents.vertex.add(editorEnv.signalGraph, definedId, type, state);
        newOutput = new SegmentsOutput(
          definedId,
          new Vector2(x, y),
          ComponentType.INPUT,
          canvasWidth,
          canvasHeight,
          [],
          editorEnv.nodeImageList,
          editorEnv.signalGraph,
          shiftPosition
        );
        model = SegmentsOutputModel;
        break;
      default:
        console.error(
          'O tipo de node de saída passado como parâmetro é inválido!',
          type
        );
        return -1;
    }

    editorEnv.nodes.set(definedId, newOutput);
    const output = editorEnv.nodes.get(definedId)!;
    editorEnv.updateComponentId(id >= 0 ? id : undefined);

    if (slotIds.length === 0) {
      const slotParams = model.connectionSlot;
      for (const slot of Object.values(slotParams)) {
        const slotKey = this.slot(
          undefined,
          editorEnv,
          slot.localPos.x,
          slot.localPos.y,
          output,
          slot.in
        );
        if (!output.slots.find(slot => slot.id === slotKey)) {
          const slot = editorEnv.slots.get(slotKey);
          if (slot) output.slots.push(slot);
        }
      }
    } else {
      for (const slotId of slotIds) {
        const slot = editorEnv.slots.get(slotId);
        if (slot) output.slots.push(slot);
      }
    }

    return definedId;
  },

  slot(
    id: number = -1,
    editorEnv: EditorEnvironment,
    x: number,
    y: number,
    parent: NodeInterface,
    inSlot?: boolean,
    radius?: number,
    attractionRadius?: number,
    color?: string,
    colorActive?: string
  ): number {
    const definedId = id >= 0 ? id : editorEnv.nextComponentId;
    const newSlot = new SlotComponent(
      definedId,
      new Vector2(x, y),
      parent,
      undefined,
      inSlot,
      radius,
      attractionRadius,
      color,
      colorActive
    );
    editorEnv.slots.set(definedId, newSlot);
    if (
      parent.componentType === ComponentType.INPUT ||
      parent.componentType === ComponentType.OUTPUT ||
      parent.componentType === ComponentType.NODE
    ) {
      (parent as NodeInterface).slots.push(editorEnv.slots.get(definedId)!);
    }
    return editorEnv.updateComponentId(id >= 0 ? id : undefined);
  },

  connection(
    id: number = -1,
    editorEnv: EditorEnvironment,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    from?: ConnectionVertex,
    to?: ConnectionVertex,
    anchors?: Array<Vector2>
  ): number {
    const definedId = id >= 0 ? id : editorEnv.nextComponentId;
    const newLine = new ConnectionComponent(
      definedId,
      new Vector2(x1, y1),
      new Vector2(x2, y2),
      {start: from, end: to},
      anchors
    );
    editorEnv.connections.set(definedId, newLine);
    return editorEnv.updateComponentId(id >= 0 ? id : undefined);
  },

  text(
    id: number = -1,
    editorEnv: EditorEnvironment,
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    style?: string,
    parent?: Component
  ): number {
    const definedId = id >= 0 ? id : editorEnv.nextComponentId;
    const newText = new TextComponent(
      definedId,
      new Vector2(x, y),
      text,
      style,
      parent ? {id: parent.id, type: parent.componentType} : null,
      ctx
    );
    editorEnv.texts.set(definedId, newText);
    return editorEnv.updateComponentId(id >= 0 ? id : undefined);
  },
};

export default addComponent;
