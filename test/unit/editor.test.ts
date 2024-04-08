import EditorEnvironment from '../../src/EditorEnvironment';
import {addNode} from '../../src/functions/component/addComponent';
import {NodeTypes} from '../../src/types/types';

let editorEnv: EditorEnvironment | undefined;

describe('Conjunto de testes com a criação de elementos a partir do ambiente do editor', () => {
  beforeAll(() => {
    editorEnv = new EditorEnvironment('test-mode', 0, undefined);
  });
  test('Criar node', () => {
    const nodeId = addNode(
      undefined,
      editorEnv!,
      1920,
      1080,
      NodeTypes.G_AND,
      120,
      100
    );
    expect(nodeId).toBeDefined();
    expect(nodeId).toBe(0);
  });
});
