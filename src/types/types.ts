import ConnectionComponent from '../components/ConnectionComponent';
import NodeComponent from '../components/NodeComponent';
import SlotComponent from '../components/SlotComponent';
import TextComponent from '../components/TextComponent';
import Vector2 from './Vector2';

enum ComponentType {
  LINE = 1,
  NODE = 2,
  TEXT = 3,
  SLOT = 4,
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

export enum EditorMode {
  ADD = 0,
  MOVE = 1,
  SELECT = 2,
  PROP = 3,
}

export interface ImageListObject {
  [index: string]: HTMLImageElement;
}

export interface nodeListInterface {
  [index: number]: NodeComponent;
}

export interface slotListInterface {
  [index: number]: SlotComponent;
}

export interface connectionListInterface {
  [index: number]: ConnectionComponent;
}

export interface textListInterface {
  [index: number]: TextComponent;
}

export interface componentListInterface {
  [index: string]:
    | nodeListInterface
    | slotListInterface
    | connectionListInterface
    | textListInterface;
  nodes: nodeListInterface;
  slots: slotListInterface;
  connections: connectionListInterface;
  texts: textListInterface;
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
export interface NodeTypeInterface {
  readonly id: nodeTypes;
  readonly connectionSlots: Array<{
    id: number; // Identificador do slot (0 => inA, 1 => inB, ...)
    name: string; // Nome do slot (adiciona textNode?)
    status: boolean; // Ativo ou inativo
    localPos: Vector2; // Posição do slot, relativo ao elemento-pai
    in: boolean; // Recebe informação de outro elemento (true)
    slotId: number; // Slot ao qual esse elemento está conectado
  }>;
  readonly op: (slotsState: Array<boolean>) => boolean; // Operação booleana envolvendo o valor atual dos slots
}

export default ComponentType;
