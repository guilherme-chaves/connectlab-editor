import {gzipSync, gunzipSync} from 'fflate';
import EditorEnvironment from '@connectlab-editor/environment';
import Editor from '@connectlab-editor';

export function loadFile(
  editor: Editor,
  ctx: CanvasRenderingContext2D,
  ev: Event
): void {
  if (!ev.target) {
    console.error('Falha ao tentar carregar os dados da entrada de dados');
    return;
  }
  const input = ev.target as HTMLInputElement;
  if (!input.files) return;
  const reader = new FileReader();
  reader.readAsArrayBuffer(input.files[0]);
  reader.onload = () => {
    if (!reader.result || typeof reader.result === 'string') return;
    const unzipped = gunzipSync(new Uint8Array(reader.result));
    const jsonData = JSON.parse(new TextDecoder().decode(unzipped));
    // if (!(jsonData instanceof EditorEnvironmentObject))
    editor.editorEnv = EditorEnvironment.createFromJson(
      jsonData,
      ctx,
      editor.editorEnv.nodeImageList
    );
  };
}

export function saveToFile(editorEnv: EditorEnvironment) {
  const a = document.createElement('a');
  const file = new TextEncoder().encode(editorEnv.saveAsJson());
  const compressed = gzipSync(file, {level: 6});
  a.href = URL.createObjectURL(
    new Blob([compressed], {type: 'application/gzip'})
  );
  a.download = `${editorEnv.documentId}-save-${Date.now()}.save`;
  a.click();
}

export function clearEditor(editorEnv: EditorEnvironment) {
  editorEnv.nodes.clear();
  editorEnv.connections.clear();
  editorEnv.slots.clear();
  editorEnv.texts.clear();
  editorEnv.signalGraph = {};
  editorEnv = new EditorEnvironment(
    editorEnv.documentId,
    0,
    editorEnv.nodeImageList
  );
}
