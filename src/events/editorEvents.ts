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
) {
  window.addEventListener('load', () => {
    editor.resize();
    setInterval(editor.compute, 1000.0 / editor.tickRate);
    editor.update();
  });
  window.addEventListener('resize', () => {
    editor.resize();
  });
  canvasDOM.addEventListener('mousedown', ({x, y}) => {
    editor.mouse.clicked = true;
    if (editor.mouse.stateChanged)
      editor.mouse.clickStartPosition = editor.computePositionInCanvas(x, y);
  });
  canvasDOM.addEventListener('mouseup', () => {
    editor.mouse.clicked = false;
  });
  canvasDOM.addEventListener('mouseout', () => {
    editor.mouse.clicked = false;
  });
  window.addEventListener('mousemove', ({x, y}) => {
    editor.mouse.position = editor.computePositionInCanvas(x, y);
  });
  window.addEventListener('keydown', (ev: KeyboardEvent) => {
    editor.keyboardEvents.onKeyDown(ev, editor);
  });
  window.addEventListener('keyup', () => {
    editor.keyboardEvents.onKeyUp();
  });
  document
    .getElementById('save-editor')
    ?.addEventListener('click', () => saveToFile(editor.editorEnv));
  document.getElementById('load-editor')?.addEventListener('click', () => {
    document.getElementById('load-editor-file')?.click();
    return;
  });
  document
    .getElementById('load-editor-file')
    ?.addEventListener('change', ev => loadFile(editor, editor.canvasCtx, ev));
  document.getElementById('clear-editor')?.addEventListener('click', () => {
    clearEditor(editor.editorEnv);
  });
}
