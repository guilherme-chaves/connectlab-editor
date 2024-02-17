import {NodeTypeObject, NodeTypes} from '../types/types';
import Point2i from '../types/Point2i';
import ADDPath from '../assets/gates/AND_ANSI.svg';
import NANDPath from '../assets/gates/NAND_ANSI.svg';
import NORPath from '../assets/gates/NOR_ANSI.svg';
import NOTPath from '../assets/gates/NOT_ANSI.svg';
import ORPath from '../assets/gates/OR_ANSI.svg';
import XNORPath from '../assets/gates/XNOR_ANSI.svg';
import XORPath from '../assets/gates/XOR_ANSI.svg';

export const ADDNode: NodeTypeObject = {
  id: NodeTypes.ADD,
  imgPaths: [ADDPath],
  connectionSlot: [
    {
      id: 0,
      name: 'A',
      in: true,
      localPos: new Point2i(0, 15),
    },
    {
      id: 1,
      name: 'B',
      in: true,
      localPos: new Point2i(0, 35),
    },
    {
      id: 2,
      name: 'C',
      in: false,
      localPos: new Point2i(88, 25),
    },
  ],
  op(slotState) {
    return slotState.length >= 2 ? slotState[0] && slotState[1] : false;
  },
};

export const NANDNode: NodeTypeObject = {
  id: NodeTypes.NAND,
  imgPaths: [NANDPath],
  connectionSlot: [
    {
      id: 0,
      name: 'A',
      in: true,
      localPos: new Point2i(0, 15),
    },
    {
      id: 1,
      name: 'B',
      in: true,
      localPos: new Point2i(0, 35),
    },
    {
      id: 2,
      name: 'C',
      in: false,
      localPos: new Point2i(88, 25),
    },
  ],
  op(slotState) {
    return slotState.length >= 2 ? !(slotState[0] && slotState[1]) : false;
  },
};

export const NORNode: NodeTypeObject = {
  id: NodeTypes.NOR,
  imgPaths: [NORPath],
  connectionSlot: [
    {
      id: 0,
      name: 'A',
      in: true,
      localPos: new Point2i(0, 15),
    },
    {
      id: 1,
      name: 'B',
      in: true,
      localPos: new Point2i(0, 35),
    },
    {
      id: 2,
      name: 'C',
      in: false,
      localPos: new Point2i(88, 25),
    },
  ],
  op(slotState) {
    return slotState.length >= 2 ? !(slotState[0] || slotState[1]) : false;
  },
};

export const NOTNode: NodeTypeObject = {
  id: NodeTypes.NOT,
  imgPaths: [NOTPath],
  connectionSlot: [
    {
      id: 0,
      name: 'In',
      in: true,
      localPos: new Point2i(0, 25),
    },
    {
      id: 1,
      name: 'Out',
      in: false,
      localPos: new Point2i(88, 25),
    },
  ],
  op(slotState) {
    return slotState.length >= 1 ? !slotState[0] : true;
  },
};

export const ORNode: NodeTypeObject = {
  id: NodeTypes.OR,
  imgPaths: [ORPath],
  connectionSlot: [
    {
      id: 0,
      name: 'A',
      in: true,
      localPos: new Point2i(0, 15),
    },
    {
      id: 1,
      name: 'B',
      in: true,
      localPos: new Point2i(0, 35),
    },
    {
      id: 2,
      name: 'C',
      in: false,
      localPos: new Point2i(88, 25),
    },
  ],
  op(slotState) {
    return slotState.length >= 2 ? slotState[0] || slotState[1] : false;
  },
};

export const XNORNode: NodeTypeObject = {
  id: NodeTypes.XNOR,
  imgPaths: [XNORPath],
  connectionSlot: [
    {
      id: 0,
      name: 'A',
      in: true,
      localPos: new Point2i(0, 15),
    },
    {
      id: 1,
      name: 'B',
      in: true,
      localPos: new Point2i(0, 35),
    },
    {
      id: 2,
      name: 'C',
      in: false,
      localPos: new Point2i(88, 25),
    },
  ],
  op(slotState) {
    return slotState.length >= 2 ? slotState[0] === slotState[1] : false;
  },
};

export const XORNode: NodeTypeObject = {
  id: NodeTypes.XOR,
  imgPaths: [XORPath],
  connectionSlot: [
    {
      id: 0,
      name: 'A',
      in: true,
      localPos: new Point2i(0, 15),
    },
    {
      id: 1,
      name: 'B',
      in: true,
      localPos: new Point2i(0, 35),
    },
    {
      id: 2,
      name: 'C',
      in: false,
      localPos: new Point2i(88, 25),
    },
  ],
  op(slotState) {
    return slotState.length >= 2 ? slotState[0] !== slotState[1] : false;
  },
};
