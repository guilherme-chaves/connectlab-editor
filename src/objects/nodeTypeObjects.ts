import {NodeTypeObject, NodeTypes} from '../types/types';
import Vector2 from '../types/Vector2';
import ADDPath from '../assets/gates/AND_ANSI.svg';
import NANDPath from '../assets/gates/NAND_ANSI.svg';
import NORPath from '../assets/gates/NOR_ANSI.svg';
import NOTPath from '../assets/gates/NOT_ANSI.svg';
import ORPath from '../assets/gates/OR_ANSI.svg';
import XNORPath from '../assets/gates/XNOR_ANSI.svg';
import XORPath from '../assets/gates/XOR_ANSI.svg';

export const ADDNode: NodeTypeObject = {
  id: NodeTypes.G_ADD,
  imgPath: [ADDPath],
  connectionSlot: [
    {
      id: 0,
      name: 'A',
      in: true,
      localPos: new Vector2(0, 15),
    },
    {
      id: 1,
      name: 'B',
      in: true,
      localPos: new Vector2(0, 35),
    },
    {
      id: 2,
      name: 'C',
      in: false,
      localPos: new Vector2(88, 25),
    },
  ],
  op(slotState) {
    return slotState[0] && slotState[1];
  },
};

export const NANDNode: NodeTypeObject = {
  id: NodeTypes.G_NAND,
  imgPath: [NANDPath],
  connectionSlot: [
    {
      id: 0,
      name: 'A',
      in: true,
      localPos: new Vector2(0, 15),
    },
    {
      id: 1,
      name: 'B',
      in: true,
      localPos: new Vector2(0, 35),
    },
    {
      id: 2,
      name: 'C',
      in: false,
      localPos: new Vector2(88, 25),
    },
  ],
  op(slotState) {
    return !(slotState[0] && slotState[1]);
  },
};

export const NORNode: NodeTypeObject = {
  id: NodeTypes.G_NOR,
  imgPath: [NORPath],
  connectionSlot: [
    {
      id: 0,
      name: 'A',
      in: true,
      localPos: new Vector2(0, 15),
    },
    {
      id: 1,
      name: 'B',
      in: true,
      localPos: new Vector2(0, 35),
    },
    {
      id: 2,
      name: 'C',
      in: false,
      localPos: new Vector2(88, 25),
    },
  ],
  op(slotState) {
    return !(slotState[0] || slotState[1]);
  },
};

export const NOTNode: NodeTypeObject = {
  id: NodeTypes.G_NOT,
  imgPath: [NOTPath],
  connectionSlot: [
    {
      id: 0,
      name: 'In',
      in: true,
      localPos: new Vector2(0, 25),
    },
    {
      id: 1,
      name: 'Out',
      in: false,
      localPos: new Vector2(88, 25),
    },
  ],
  op(slotState) {
    return !slotState[0];
  },
};

export const ORNode: NodeTypeObject = {
  id: NodeTypes.G_OR,
  imgPath: [ORPath],
  connectionSlot: [
    {
      id: 0,
      name: 'A',
      in: true,
      localPos: new Vector2(0, 15),
    },
    {
      id: 1,
      name: 'B',
      in: true,
      localPos: new Vector2(0, 35),
    },
    {
      id: 2,
      name: 'C',
      in: false,
      localPos: new Vector2(88, 25),
    },
  ],
  op(slotState) {
    return slotState[0] || slotState[1];
  },
};

export const XNORNode: NodeTypeObject = {
  id: NodeTypes.G_XNOR,
  imgPath: [XNORPath],
  connectionSlot: [
    {
      id: 0,
      name: 'A',
      in: true,
      localPos: new Vector2(0, 15),
    },
    {
      id: 1,
      name: 'B',
      in: true,
      localPos: new Vector2(0, 35),
    },
    {
      id: 2,
      name: 'C',
      in: false,
      localPos: new Vector2(88, 25),
    },
  ],
  op(slotState) {
    return slotState[0] === slotState[1];
  },
};

export const XORNode: NodeTypeObject = {
  id: NodeTypes.G_XOR,
  imgPath: [XORPath],
  connectionSlot: [
    {
      id: 0,
      name: 'A',
      in: true,
      localPos: new Vector2(0, 15),
    },
    {
      id: 1,
      name: 'B',
      in: true,
      localPos: new Vector2(0, 35),
    },
    {
      id: 2,
      name: 'C',
      in: false,
      localPos: new Vector2(88, 25),
    },
  ],
  op(slotState) {
    return slotState[0] !== slotState[1];
  },
};
