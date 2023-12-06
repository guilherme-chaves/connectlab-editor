import {NodeTypeObject, NodeTypes} from '../types/types';
import Vector2 from '../types/Vector2';

const ADDNode: NodeTypeObject = {
  id: NodeTypes.ADD,
  connectionSlots: [
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
  op(slotsState) {
    return slotsState[0] && slotsState[1];
  },
};

const NANDNode: NodeTypeObject = {
  id: NodeTypes.NAND,
  connectionSlots: [
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
  op(slotsState) {
    return !(slotsState[0] && slotsState[1]);
  },
};

const NORNode: NodeTypeObject = {
  id: NodeTypes.NOR,
  connectionSlots: [
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
  op(slotsState) {
    return !(slotsState[0] || slotsState[1]);
  },
};

const NOTNode: NodeTypeObject = {
  id: NodeTypes.NOT,
  connectionSlots: [
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
  op(slotsState) {
    return !slotsState[0];
  },
};

const ORNode: NodeTypeObject = {
  id: NodeTypes.OR,
  connectionSlots: [
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
  op(slotsState) {
    return slotsState[0] || slotsState[1];
  },
};

const XNORNode: NodeTypeObject = {
  id: NodeTypes.XNOR,
  connectionSlots: [
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
  op(slotsState) {
    return slotsState[0] === slotsState[1];
  },
};

const XORNode: NodeTypeObject = {
  id: NodeTypes.XOR,
  connectionSlots: [
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
  op(slotsState) {
    return slotsState[0] !== slotsState[1];
  },
};

export {ADDNode, NANDNode, NORNode, NOTNode, ORNode, XNORNode, XORNode};
