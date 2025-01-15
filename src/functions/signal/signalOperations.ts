import {slotStates} from '@connectlab-editor/types/common';

const input_output = (slotState: [slotStates, slotStates]) => slotState[0];

const and = (slotState: [slotStates, slotStates]) =>
  slotState[0] && slotState[1];

const nand = (slotState: [slotStates, slotStates]) =>
  !(slotState[0] && slotState[1]);

const nor = (slotState: [slotStates, slotStates]) =>
  !(slotState[0] || slotState[1]);

const not = (slotState: [slotStates, slotStates]) => !slotState[0];

const or = (slotState: [slotStates, slotStates]) =>
  slotState[0] || slotState[1];

const xnor = (slotState: [slotStates, slotStates]) =>
  slotState[0] === slotState[1];

const xor = (slotState: [slotStates, slotStates]) =>
  slotState[0] !== slotState[1];

export const signalOperations = {
  input_output,
  and,
  nand,
  nor,
  not,
  or,
  xnor,
  xor,
};
