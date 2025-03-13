import {slotStates} from '@connectlab-editor/types/common';

const input_output = (slotState: Record<number, [number, slotStates]>) => {
  for (const state of Object.values(slotState)) return state[1];
  return false;
};

const and = (slotState: Record<number, [number, slotStates]>) => {
  let accumulator = true;
  for (const state of Object.values(slotState))
    accumulator = accumulator && state[1];
  return accumulator;
};

const nand = (slotState: Record<number, [number, slotStates]>) => {
  let accumulator = true;
  for (const state of Object.values(slotState))
    accumulator = accumulator && state[1];
  return !accumulator;
};

const nor = (slotState: Record<number, [number, slotStates]>) => {
  let accumulator = false;
  for (const state of Object.values(slotState))
    accumulator = accumulator || state[1];
  return !accumulator;
};

const not = (slotState: Record<number, [number, slotStates]>) => {
  for (const state of Object.values(slotState)) return !state[1];
  return true;
};

const or = (slotState: Record<number, [number, slotStates]>) => {
  let accumulator = false;
  for (const state of Object.values(slotState))
    accumulator = accumulator || state[1];
  return accumulator;
};

const xnor = (slotState: Record<number, [number, slotStates]>) => {
  let accumulator: boolean | undefined = undefined;
  for (const state of Object.values(slotState)) {
    if (accumulator === undefined) {
      accumulator = state[1];
      continue;
    }

    accumulator = accumulator === state[1];
  }
  return accumulator ?? false;
};

const xor = (slotState: Record<number, [number, slotStates]>) => {
  let accumulator: boolean | undefined = undefined;
  for (const state of Object.values(slotState)) {
    if (accumulator === undefined) {
      accumulator = state[1];
      continue;
    }

    accumulator = accumulator !== state[1];
  }
  return accumulator ?? false;
};

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
