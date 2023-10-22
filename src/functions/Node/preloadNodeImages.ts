import ADDPath from '../../assets/gates/AND_ANSI.svg';
import NANDPath from '../../assets/gates/NAND_ANSI.svg';
import NORPath from '../../assets/gates/NOR_ANSI.svg';
import NOTPath from '../../assets/gates/NOT_ANSI.svg';
import ORPath from '../../assets/gates/OR_ANSI.svg';
import XNORPath from '../../assets/gates/XNOR_ANSI.svg';
import XORPath from '../../assets/gates/XOR_ANSI.svg';
import {nodeTypes} from '../../types/types';
import preloadImage from '../preloadImage';

const imageList = [
  [`${nodeTypes.ADD}`, ADDPath],
  [`${nodeTypes.NAND}`, NANDPath],
  [`${nodeTypes.NOR}`, NORPath],
  [`${nodeTypes.NOT}`, NOTPath],
  [`${nodeTypes.OR}`, ORPath],
  [`${nodeTypes.XNOR}`, XNORPath],
  [`${nodeTypes.XOR}`, XORPath],
];

export default function preloadNodeImages() {
  return preloadImage(imageList);
}
