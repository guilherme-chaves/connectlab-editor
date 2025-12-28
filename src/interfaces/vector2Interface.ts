import { VectorObject } from '@connectlab-editor/types/common';

export default interface Vector2 {
  type: 'int' | 'float'
  x: number
  y: number
  clone(): Vector2
  toPlainObject(): VectorObject
}
