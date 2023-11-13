import ConnectionComponent from '../components/ConnectionComponent';
import InputComponent from '../components/InputComponent';
import NodeComponent from '../components/NodeComponent';
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
  MONO_LED = 1,
}

export enum EditorMode {
  ADD = 0,
  MOVE = 1,
  SELECT = 2,
  PROP = 3,
}

export interface ImageListObject {
  [index: string]: HTMLImageElement;
}

export interface NodeList {
  [index: number]: NodeComponent;
}

export interface SlotList {
  [index: number]: SlotComponent;
}

export interface ConnectionList {
  [index: number]: ConnectionComponent;
}

export interface TextList {
  [index: number]: TextComponent;
}

export interface InputList {
  [index: number]: InputComponent;
}

export interface componentListInterface {
  [index: string]: NodeList | SlotList | ConnectionList | TextList | InputList;
  nodes: NodeList;
  slots: SlotList;
  connections: ConnectionList;
  texts: TextList;
  inputs: InputList;
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

export default ComponentType;
