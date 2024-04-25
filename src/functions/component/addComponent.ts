import EditorEnvironment from '@connectlab-editor/environment';
import ConnectionComponent from '@connectlab-editor/components/ConnectionComponent';
import NodeComponent from '@connectlab-editor/components/NodeComponent';
import SlotComponent from '@connectlab-editor/components/SlotComponent';
import TextComponent from '@connectlab-editor/components/TextComponent';
import Component from '@connectlab-editor/interfaces/componentInterface';
import Vector2 from '@connectlab-editor/types/Vector2';
import {
  ComponentType,
  ConnectionVertex,
  NodeTypes,
} from '@connectlab-editor/types';
import signalEvents from '@connectlab-editor/signal/signalEvents';

export function addNode(
  id: number = -1,
  editorEnv: EditorEnvironment,
  canvasWidth: number,
  canvasHeight: number,
  type: NodeTypes,
  x: number,
  y: number,
  componentType = ComponentType.NODE,
  slotIds: number[] = [],
  shiftPosition = true,
  state: boolean = false
): number {
  const definedId = id >= 0 ? id : editorEnv.nextComponentId;

  signalEvents.addVertex(editorEnv.signalGraph, definedId, type, state);

  if (
    componentType === ComponentType.LINE ||
    componentType === ComponentType.SLOT ||
    componentType === ComponentType.TEXT
  )
    componentType = ComponentType.NODE;

  let newNode = new NodeComponent(
    definedId,
    new Vector2(x, y),
    componentType,
    type,
    canvasWidth,
    canvasHeight,
    [],
    editorEnv.nodeImageList,
    editorEnv.signalGraph,
    shiftPosition
  );
  editorEnv.nodes.set(definedId, newNode);
  newNode = editorEnv.nodes.get(definedId)!;
  editorEnv.updateComponentId(id >= 0 ? id : undefined);

  if (slotIds.length === 0) {
    const slotParams = NodeComponent.getNodeModel(type).connectionSlot;
    for (const slot of Object.values(slotParams)) {
      const slotKey = addSlot(
        undefined,
        editorEnv,
        slot.localPos.x,
        slot.localPos.y,
        newNode,
        slot.in
      );
      if (!newNode.slots.find(slot => slot.id === slotKey)) {
        const slot = editorEnv.slots.get(slotKey);
        if (slot) newNode.slots.push(slot);
      }
    }
  } else {
    for (const slotId of slotIds) {
      const slot = editorEnv.slots.get(slotId);
      if (slot) newNode.slots.push(slot);
    }
  }

  return definedId;
}

export function addInput(
  id: number = -1,
  editorEnv: EditorEnvironment,
  canvasWidth: number,
  canvasHeight: number,
  type: NodeTypes,
  x: number,
  y: number,
  slotIds?: number[],
  shiftPosition = true,
  state: boolean = false
): number {
  return addNode(
    id,
    editorEnv,
    canvasWidth,
    canvasHeight,
    type,
    x,
    y,
    ComponentType.INPUT,
    slotIds,
    shiftPosition,
    state
  );
}

export function addOutput(
  id: number = -1,
  editorEnv: EditorEnvironment,
  canvasWidth: number,
  canvasHeight: number,
  type: NodeTypes,
  x: number,
  y: number,
  slotIds?: number[],
  shiftPosition = true,
  state: boolean = false
): number {
  return addNode(
    id,
    editorEnv,
    canvasWidth,
    canvasHeight,
    type,
    x,
    y,
    ComponentType.OUTPUT,
    slotIds,
    shiftPosition,
    state
  );
}

export function addSlot(
  id: number = -1,
  editorEnv: EditorEnvironment,
  x: number,
  y: number,
  parent: Component,
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
    (parent as NodeComponent).slots.push(editorEnv.slots.get(definedId)!);
  }
  return editorEnv.updateComponentId(id >= 0 ? id : undefined);
}

export function addConnection(
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
}

export function addText(
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
}
