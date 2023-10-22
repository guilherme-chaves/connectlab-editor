import {NodeTypeInterface, nodeTypes} from './types';
import Vector2 from './Vector2';

const ADDNode: NodeTypeInterface = {
  id: nodeTypes.ADD,
  connectionSlots: [
    {
      id: 0,
      name: 'A',
      in: true,
      localPos: new Vector2(-8, -8),
      slotId: -1,
      status: false,
    },
    {
      id: 1,
      name: 'B',
      in: true,
      localPos: new Vector2(-8, 8),
      slotId: -1,
      status: false,
    },
    {
      id: 2,
      name: 'C',
      in: false,
      localPos: new Vector2(8, 0),
      slotId: -1,
      status: false,
    },
  ],
  op(slotsState) {
    return slotsState[0] && slotsState[1];
  },
};

const ORNode: NodeTypeInterface = {
  id: nodeTypes.OR,
  connectionSlots: [
    {
      id: 0,
      name: 'A',
      in: true,
      localPos: new Vector2(-8, -8),
      slotId: -1,
      status: false,
    },
    {
      id: 1,
      name: 'B',
      in: true,
      localPos: new Vector2(-8, 8),
      slotId: -1,
      status: false,
    },
    {
      id: 2,
      name: 'C',
      in: false,
      localPos: new Vector2(8, 0),
      slotId: -1,
      status: false,
    },
  ],
  op(slotsState) {
    return slotsState[0] || slotsState[1];
  },
};

const NOTNode: NodeTypeInterface = {
  id: nodeTypes.NOT,
  connectionSlots: [
    {
      id: 0,
      name: 'In',
      in: true,
      localPos: new Vector2(0, 25),
      slotId: -1,
      status: false,
    },
    {
      id: 1,
      name: 'Out',
      in: false,
      localPos: new Vector2(88, 25),
      slotId: -1,
      status: false,
    },
  ],
  op(slotsState) {
    return !slotsState[0];
  },
};

export {ADDNode, ORNode, NOTNode};
