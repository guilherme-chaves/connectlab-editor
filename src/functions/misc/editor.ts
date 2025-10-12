import { gzipSync, gunzipSync } from 'fflate';
import EditorEnvironment from '@connectlab-editor/environment';
import Editor from '@connectlab-editor/editor';
import { fileValidator } from '@connectlab-editor/types/file';

export function loadFile(
  editor: Editor,
  ctx: CanvasRenderingContext2D,
  ev: Event,
): void {
  if (!ev.target) {
    console.error('Falha ao tentar carregar os dados da entrada de dados');
    return;
  }
  const input = ev.target as HTMLInputElement;
  if (!input.files || !input.files[0]) return;
  const reader = new FileReader();
  reader.readAsArrayBuffer(input.files[0]);
  reader.onload = () => {
    if (!reader.result || typeof reader.result === 'string') return;
    const unzipped = gunzipSync(new Uint8Array(reader.result));
    const jsonData: unknown = JSON.parse(new TextDecoder().decode(unzipped));

    if (
      typeof jsonData.id !== 'string' &&
      typeof jsonData.data.nodes !== 'object' &&
      Number.isInteger(jsonData.data.nodes.length) &&
      typeof jsonData.data.connections !== 'object' &&
      Number.isInteger(jsonData.data.connections.length) &&
      typeof jsonData.data.slots !== 'object' &&
      Number.isInteger(jsonData.data.slots.length) &&
      typeof jsonData.data.texts !== 'object' &&
      Number.isInteger(jsonData.data.texts.length) &&
      typeof jsonData.signal !== 'object'
    ) {
      window.alert(
        'Falha ao carregar projeto! Arquivo inválido ou corrompido.'
      );
      console.error(
        'Falha ao carregar projeto! Arquivo inválido ou corrompido.'
      );
      return;
    }
    editor.editorEnv = EditorEnvironment.createFromJson(
      jsonData,
      ctx,
      editor.editorEnv.nodeImageList,
    );
  };
}

export function saveToFile(editorEnv: EditorEnvironment): void {
  const fileName = window.prompt(
    'Salvar projeto como:',
    `${editorEnv.documentId}-${Date.now()}`,
  );
  if (fileName === null) return;
  const a = document.createElement('a');
  const file = new TextEncoder().encode(editorEnv.saveAsJson());
  const compressed = gzipSync(file, { level: 6 });
  a.href = URL.createObjectURL(
    new Blob([compressed as BlobPart], { type: 'application/gzip' }),
  );
  a.download = `${fileName}.simulation`;
  a.click();
}

export function clearEditor(
  editorEnv: EditorEnvironment,
): EditorEnvironment | null {
  if (
    confirm(
      'Deseja limpar o editor?\nQualquer progresso não salvo será perdido!',
    ) === true
  ) {
    return new EditorEnvironment(
      editorEnv.documentId,
      0,
      editorEnv.nodeImageList,
    );
  }
  return null;
}
