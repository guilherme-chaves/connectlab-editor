import {slotStates} from '../../types/types';

export const input_output = (slotState: [slotStates, slotStates]) =>
  slotState[0];

export const and = (slotState: [slotStates, slotStates]) =>
  slotState[0] && slotState[1];

export const nand = (slotState: [slotStates, slotStates]) =>
  !(slotState[0] && slotState[1]);

export const nor = (slotState: [slotStates, slotStates]) =>
  !(slotState[0] || slotState[1]);

export const not = (slotState: [slotStates, slotStates]) => !slotState[0];

export const or = (slotState: [slotStates, slotStates]) =>
  slotState[0] || slotState[1];

export const xnor = (slotState: [slotStates, slotStates]) =>
  slotState[0] === slotState[1];

export const xor = (slotState: [slotStates, slotStates]) =>
  slotState[0] !== slotState[1];
