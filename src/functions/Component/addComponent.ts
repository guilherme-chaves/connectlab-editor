import EditorEnvironment from '../../EditorEnvironment';
import ConnectionComponent from '../../components/ConnectionComponent';
import InputComponent from '../../components/InputComponent';
import NodeComponent from '../../components/NodeComponent';
import OutputComponent from '../../components/OutputComponent';
import SlotComponent from '../../components/SlotComponent';
import TextComponent from '../../components/TextComponent';
import Component from '../../interfaces/componentInterface';
import Vector2 from '../../types/Vector2';
import ComponentType, {
  ConnectionVertex,
  InputTypes,
  NodeTypes,
  OutputTypes,
} from '../../types/types';
import signalEvents from '../Signal/signalEvents';

export function addNode(
  editorEnv: EditorEnvironment,
  ctx: CanvasRenderingContext2D,
  type: NodeTypes,
  x: number,
  y: number
): number {
  const slots: Array<SlotComponent> = [];
  let newNode = new NodeComponent(
    editorEnv.nextComponentId,
    new Vector2(x, y),
    type,
    ctx.canvas.width,
    ctx.canvas.height,
    slots,
    editorEnv.nodeImageList,
    editorEnv.signalGraph
  );
  editorEnv.nodes.set(editorEnv.nextComponentId, newNode);
  newNode = editorEnv.nodes.get(editorEnv.nextComponentId)!;

  const slotParams = NodeComponent.getNodeTypeObject(type).connectionSlot;
  for (const slot of Object.values(slotParams)) {
    const slotKey = addSlot(
      editorEnv,
      slot.localPos.x,
      slot.localPos.y,
      newNode,
      slot.in
    );
    slots.push(editorEnv.slots.get(slotKey)!);
  }
  newNode.slotComponents = slots;

  signalEvents.addVertex(
    editorEnv,
    editorEnv.nextComponentId,
    undefined,
    signalEvents.convertToSignalFromList(
      editorEnv,
      newNode.id,
      ComponentType.NODE
    )
  );
  return editorEnv.updateComponentId();
}

export function addInput(
  editorEnv: EditorEnvironment,
  ctx: CanvasRenderingContext2D,
  type: InputTypes,
  x: number,
  y: number
): number {
  let newInput = new InputComponent(
    editorEnv.nextComponentId,
    new Vector2(x, y),
    ctx.canvas.width,
    ctx.canvas.height,
    type,
    undefined,
    editorEnv.inputImageList,
    editorEnv.signalGraph
  );
  editorEnv.inputs.set(editorEnv.nextComponentId, newInput);
  newInput = editorEnv.inputs.get(editorEnv.nextComponentId)!;

  const slotInfo = InputComponent.getInputTypeObject(type).connectionSlot;
  const slotId = addSlot(
    editorEnv,
    slotInfo.localPos.x,
    slotInfo.localPos.y,
    newInput,
    false
  );
  newInput.slotComponents = [editorEnv.slots.get(slotId)!];
  signalEvents.addVertex(
    editorEnv,
    editorEnv.nextComponentId,
    undefined,
    signalEvents.convertToSignalFromList(
      editorEnv,
      newInput.id,
      ComponentType.INPUT
    )
  );
  return editorEnv.updateComponentId();
}

export function addOutput(
  editorEnv: EditorEnvironment,
  ctx: CanvasRenderingContext2D,
  type: OutputTypes,
  x: number,
  y: number
): number {
  let newOutput = new OutputComponent(
    editorEnv.nextComponentId,
    new Vector2(x, y),
    ctx.canvas.width,
    ctx.canvas.height,
    type,
    undefined,
    editorEnv.outputImageList,
    editorEnv.signalGraph
  );
  editorEnv.outputs.set(editorEnv.nextComponentId, newOutput);
  newOutput = editorEnv.outputs.get(editorEnv.nextComponentId)!;

  const slotInfo = OutputComponent.getOutputTypeObject(type)[0].connectionSlot;
  const slotId = addSlot(
    editorEnv,
    slotInfo.localPos.x,
    slotInfo.localPos.y,
    newOutput,
    true
  );
  newOutput.slotComponents = [editorEnv.slots.get(slotId)!];

  signalEvents.addVertex(
    editorEnv,
    editorEnv.nextComponentId,
    undefined,
    signalEvents.convertToSignalFromList(
      editorEnv,
      newOutput.id,
      ComponentType.OUTPUT
    )
  );
  return editorEnv.updateComponentId();
}

export function addSlot(
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
  const newSlot = new SlotComponent(
    editorEnv.nextComponentId,
    new Vector2(x, y),
    parent,
    undefined,
    inSlot,
    radius,
    attractionRadius,
    color,
    colorActive
  );
  editorEnv.slots.set(editorEnv.nextComponentId, newSlot);
  return editorEnv.updateComponentId();
}

export function addConnection(
  editorEnv: EditorEnvironment,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  from?: ConnectionVertex,
  to?: ConnectionVertex
): number {
  const newLine = new ConnectionComponent(
    editorEnv.nextComponentId,
    new Vector2(x1, y1),
    new Vector2(x2, y2),
    {start: from, end: to}
  );
  editorEnv.connections.set(editorEnv.nextComponentId, newLine);
  return editorEnv.updateComponentId();
}

export function addText(
  editorEnv: EditorEnvironment,
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  style?: string,
  parent?: Component
): number {
  const newText = new TextComponent(
    editorEnv.nextComponentId,
    new Vector2(x, y),
    text,
    style,
    parent,
    ctx
  );
  editorEnv.texts.set(editorEnv.nextComponentId, newText);
  return editorEnv.updateComponentId();
}
