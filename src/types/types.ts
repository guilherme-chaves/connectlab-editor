import ConnectionComponent from '../components/ConnectionComponent';
import InputComponent from '../components/InputComponent';
import NodeComponent from '../components/NodeComponent';
import OutputComponent from '../components/OutputComponent';
import SlotComponent from '../components/SlotComponent';
import TextComponent from '../components/TextComponent';
import Vector2 from './Vector2';

enum ComponentType {
  LINE = 1,
  NODE = 2,
  TEXT = 3,
  SLOT = 4,
  INPUT = 5,
  OUTPUT = 6,
}

export enum NodeTypes {
  ADD = 0,
  NAND = 1,
  NOR = 2,
  NOT = 3,
  OR = 4,
  XNOR = 5,
  XOR = 6,
}

export enum InputTypes {
  SWITCH = 0,
}

export enum OutputTypes {
  MONO_LED_OFF = 0,
  MONO_LED_RED = 1,
}

export enum EditorMode {
  ADD = 0,
  MOVE = 1,
  SELECT = 2,
  PROP = 3,
}

export type ImageListObject = Map<number, HTMLImageElement>;

export type NodeList = Map<number, NodeComponent>;

export type SlotList = Map<number, SlotComponent>;

export type ConnectionList = Map<number, ConnectionComponent>;

export type TextList = Map<number, TextComponent>;

export type InputList = Map<number, InputComponent>;

export type OutputList = Map<number, OutputComponent>;

export interface FullComponentList {
  [index: string]:
    | NodeList
    | SlotList
    | ConnectionList
    | TextList
    | InputList
    | OutputList;
  nodes: NodeList;
  slots: SlotList;
  connections: ConnectionList;
  texts: TextList;
  inputs: InputList;
  outputs: OutputList;
}

export interface ConnectionVertex {
  type: ComponentType;
  id: number;
}

export interface ConnectionVertices {
  [index: symbol]: ConnectionVertex | undefined;
  start: ConnectionVertex | undefined;
  end: ConnectionVertex | undefined;
}

// Modelo para criação de objetos do tipo NODE
export interface NodeTypeObject {
  readonly id: NodeTypes;
  readonly connectionSlot: Array<{
    id: number; // Identificador do slot (0 => inA, 1 => inB, ...)
    name: string; // Nome do slot (adiciona textNode?)
    localPos: Vector2; // Posição do slot, relativo ao elemento-pai
    in: boolean; // Recebe informação de outro elemento (true)
  }>;
  readonly op: (slotState: Array<boolean>) => boolean; // Operação booleana envolvendo o valor atual dos slots
}

export interface InputTypeObject {
  readonly id: InputTypes;
  readonly connectionSlot: {
    id: number;
    name: string;
    localPos: Vector2;
  };
  readonly op: (slotState: Array<boolean>) => boolean;
}

export interface OutputTypeObject {
  readonly id: OutputTypes;
  readonly connectionSlot: {
    id: number;
    name: string;
    localPos: Vector2;
  };
  readonly op: (slotState: Array<boolean>) => boolean;
}

export type SignalGraphData = {state: boolean; signalFrom: Array<number>};

export type SignalGraph = Map<number, SignalGraphData>;

export default ComponentType;
