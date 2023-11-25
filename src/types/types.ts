import ConnectionComponent from '../components/ConnectionComponent';
import InputComponent from '../components/InputComponent';
import NodeComponent from '../components/NodeComponent';
import OutputComponent from '../components/OutputComponent';
import SlotComponent from '../components/SlotComponent';
import TextComponent from '../components/TextComponent';
import Component from '../interfaces/componentInterface';
import Vector2 from './Vector2';

enum ComponentType {
  LINE = 1,
  NODE = 2,
  TEXT = 3,
  SLOT = 4,
  INPUT = 5,
  OUTPUT = 6,
}

export enum nodeTypes {
  ADD = 0,
  NAND = 1,
  NOR = 2,
  NOT = 3,
  OR = 4,
  XNOR = 5,
  XOR = 6,
}

export enum inputTypes {
  SWITCH = 0,
}

export enum outputTypes {
  MONO_LED_OFF = 0,
  MONO_LED_RED = 1,
}

export enum EditorMode {
  ADD = 0,
  MOVE = 1,
  SELECT = 2,
  PROP = 3,
}

export type ImageListObject = Record<string, HTMLImageElement>;

export type ComponentList = Record<number, Component>;

export type NodeList = Record<number, NodeComponent>;

export type SlotList = Record<number, SlotComponent>;

export type ConnectionList = Record<number, ConnectionComponent>;

export type TextList = Record<number, TextComponent>;

export type InputList = Record<number, InputComponent>;

export type OutputList = Record<number, OutputComponent>;

export interface componentListInterface {
  [index: string]: ComponentList;
  nodes: NodeList;
  slots: SlotList;
  connections: ConnectionList;
  texts: TextList;
  inputs: InputList;
  outputs: OutputList;
}

export interface componentAssocInterface {
  type: ComponentType;
  id: number;
}

export interface connectionSlotsInterface {
  [index: symbol]: componentAssocInterface | undefined;
  start: componentAssocInterface | undefined;
  end: componentAssocInterface | undefined;
}

// Modelo para criação de objetos do tipo NODE
export interface NodeTypeObject {
  readonly id: nodeTypes;
  readonly connectionSlots: Array<{
    id: number; // Identificador do slot (0 => inA, 1 => inB, ...)
    name: string; // Nome do slot (adiciona textNode?)
    localPos: Vector2; // Posição do slot, relativo ao elemento-pai
    in: boolean; // Recebe informação de outro elemento (true)
  }>;
  readonly op: (slotsState: Array<boolean>) => boolean; // Operação booleana envolvendo o valor atual dos slots
}

export interface InputTypeObject {
  readonly id: inputTypes;
  readonly connectionSlot: {
    id: number;
    name: string;
    localPos: Vector2;
  };
  readonly op: (slotState: boolean) => boolean;
}

export interface OutputTypeObject {
  readonly id: outputTypes;
  readonly connectionSlot: {
    id: number;
    name: string;
    localPos: Vector2;
  };
}

export default ComponentType;
