import Editor from '@connectlab-editor/editor';
import {
  saveToFile,
  loadFile,
  clearEditor,
} from '@connectlab-editor/functions/editor';

export default function createEditorEvents(
  editor: Editor,
  canvasDOM: HTMLCanvasElement,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _backgroundDOM: HTMLCanvasElement,
): void {
  if (!window) {
    console.error('Variável window é nula! Não será possível iniciar o editor');
    return;
  }

  window.onload = () => {
    editor.resize();
    setInterval(editor.compute, 1000.0 / editor.tickRate);
    editor.update();

    setTimeout(() => {
      document.getElementById('app')!.style.visibility = 'visible';
      document.getElementById('app-toolbar')!.style.visibility = 'visible';
      document.getElementById('app')!.className = 'animate-show';
      document.getElementById('app-toolbar')!.className = 'animate-show';
      document.getElementById('loading-div')!.style.visibility = 'hidden';
    }, 1000);
  };

  window.onresize = () => editor.resize();

  canvasDOM.onmousedown = () => editor.mouse.clicked = true;

  canvasDOM.onmouseup = canvasDOM.onmouseout = () =>
    editor.mouse.clicked = false;

  window.onmousemove = ({ x, y }) => editor.setLocalMousePosition(x, y);

  window.onkeydown = (ev: KeyboardEvent) =>
    editor.keyboard.setKeyPressed(ev.key, true);

  window.onkeyup = (ev: KeyboardEvent) =>
    editor.keyboard.setKeyPressed(ev.key, false);

  const items = document.getElementsByTagName('img');
  for (const imageItem of items) {
    if (!imageItem.classList.contains('app-component-image')
      || !imageItem.parentElement
      || !imageItem.parentElement.classList.contains('app-component')
      || !imageItem.hasAttributes()
      || !imageItem.draggable
    )
      continue;
    imageItem.parentElement.addEventListener('dragstart', (ev: DragEvent) => {
      ev.dataTransfer?.setData('text/plain', imageItem.id);
      ev.dataTransfer?.setDragImage(
        imageItem,
        imageItem.width / 2, // xOffset
        imageItem.height / 2, // yOffset
      );
    });
  }

  canvasDOM.addEventListener('dragover', (ev: DragEvent) => {
    ev.preventDefault();
  });

  canvasDOM.addEventListener('drop', (ev: DragEvent) => {
    ev.preventDefault();
    if (ev.dataTransfer) {
      editor.setLocalMousePosition(ev.x, ev.y);
      editor.addByDrapAndDrop(
        ev.dataTransfer.getData('text/plain'),
      );
    }
  });

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
    editor.editorEnv = clearEditor(editor.editorEnv);
  });
}
