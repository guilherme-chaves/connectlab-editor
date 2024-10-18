import Editor from '@connectlab-editor';
import {
  saveToFile,
  loadFile,
  clearEditor,
} from '@connectlab-editor/functions/editor';

export default function createEditorEvents(
  editor: Editor,
  canvasDOM: HTMLCanvasElement,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _backgroundDOM: HTMLCanvasElement
): void {
  if (!window) {
    console.error('Variável window é nula! Não será possível iniciar o editor');
    return;
  }
  window.onload = () => {
    editor.resize();
    setInterval(editor.compute, 1000.0 / editor.tickRate);
    editor.update();
  };

  window.onresize = () => editor.resize();

  canvasDOM.onmousedown = () => (editor.mouse.clicked = true);

  canvasDOM.onmouseup = canvasDOM.onmouseout = () =>
    (editor.mouse.clicked = false);

  window.onmousemove = ({x, y}) => editor.setLocalMousePosition(x, y);

  window.onkeydown = (ev: KeyboardEvent) =>
    editor.keyboard.setKeyPressed(ev.key, true);

  window.onkeyup = (ev: KeyboardEvent) =>
    editor.keyboard.setKeyPressed(ev.key, false);

  document
    .getElementById('save-editor')
    ?.addEventListener('click', () => saveToFile(editor.editorEnv));

  document.getElementById('load-editor')?.addEventListener('click', () => {
    document.getElementById('load-editor-file')?.click();
  });

  document
    .getElementById('load-editor-file')
    ?.addEventListener('change', ev => loadFile(editor, editor.canvasCtx, ev));

  document.getElementById('clear-editor')?.addEventListener('click', () => {
    clearEditor(editor.editorEnv);
  });
}
