import EditorEnvironment from '../../EditorEnvironment';
import ConnectionComponent from '../../components/ConnectionComponent';
import NodeComponent from '../../components/NodeComponent';
import SlotComponent from '../../components/SlotComponent';
import TextComponent from '../../components/TextComponent';
import Component from '../../interfaces/componentInterface';
import Vector2 from '../../types/Vector2';
import {ComponentType, ConnectionVertex, NodeTypes} from '../../types/types';
import signalEvents from '../Signal/signalEvents';

export function addNode(
  id: number = -1,
  editorEnv: EditorEnvironment,
  ctx: CanvasRenderingContext2D,
  type: NodeTypes,
  x: number,
  y: number,
  componentType = ComponentType.NODE,
  slotIds?: number[],
  shiftPosition = true,
  state: boolean = false
): number {
  const definedId = id >= 0 ? id : editorEnv.nextComponentId;

  signalEvents.addVertex(editorEnv, editorEnv.nextComponentId, state);

  if (
    componentType === ComponentType.LINE ||
    componentType === ComponentType.SLOT ||
    componentType === ComponentType.TEXT
  )
    componentType = ComponentType.NODE;

  const slots: Array<SlotComponent> = [];
  let newNode = new NodeComponent(
    definedId,
    new Vector2(x, y),
    componentType,
    type,
    ctx.canvas.width,
    ctx.canvas.height,
    slots,
    editorEnv.nodeImageList,
    editorEnv.signalGraph,
    shiftPosition
  );
  editorEnv.nodes.set(definedId, newNode);
  newNode = editorEnv.nodes.get(definedId)!;
  if (slotIds === undefined) {
    const slotParams = NodeComponent.getNodeTypeObject(type).connectionSlot;
    for (const slot of Object.values(slotParams)) {
      const slotKey = addSlot(
        undefined,
        editorEnv,
        slot.localPos.x,
        slot.localPos.y,
        newNode,
        slot.in
      );
      slots.push(editorEnv.slots.get(slotKey)!);
    }
    newNode.slotComponents = slots;
  }

  return editorEnv.updateComponentId(id >= 0 ? id : undefined);
}

export function addInput(
  id: number = -1,
  editorEnv: EditorEnvironment,
  ctx: CanvasRenderingContext2D,
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
    ctx,
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
  ctx: CanvasRenderingContext2D,
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
    ctx,
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
    (parent as NodeComponent).slotComponents.push(
      editorEnv.slots.get(definedId)!
    );
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
    parent,
    ctx
  );
  editorEnv.texts.set(definedId, newText);
  return editorEnv.updateComponentId(id >= 0 ? id : undefined);
}
