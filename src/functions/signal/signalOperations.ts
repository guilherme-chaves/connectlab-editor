/* eslint-disable @typescript-eslint/no-unused-vars */

function bitCount(n: number): number {
  n = n - ((n >> 1) & 0x55555555);
  n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
  return (((n + (n >> 4)) & 0xf0f0f0f) * 0x1010101) >> 24;
}

const input_output = (inputStates: number, numSlots: number) => {
  return or(inputStates, numSlots);
};

const and = (inputStates: number, numSlots: number) => {
  const cmp = (1 << numSlots) - 1;
  return (inputStates & cmp) === cmp;
};

const nand = (inputStates: number, numSlots: number) => {
  return !and(inputStates, numSlots);
};

const nor = (inputStates: number, numSlots: number) => {
  return !or(inputStates, numSlots);
};

const not = (inputStates: number, numSlots: number) => {
  if (numSlots > 1) return nor(inputStates, numSlots);
  return (inputStates & 1) !== 1;
};

const or = (inputStates: number, _numSlots: number) => {
  return (inputStates | 0) !== 0;
};

const xnor = (inputStates: number, numSlots: number) => {
  return !xor(inputStates, numSlots);
};

const xor = (inputStates: number, _numSlots: number) => {
  return bitCount(inputStates) % 2 === 1;
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
