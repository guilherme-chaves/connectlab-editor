import './style.css';
import Editor from './Editor';

const editor = new Editor(
  'teste',
  'editor-canvas',
  'editor-background',
  0.75,
  0.8
);

editor.text('Olá mundo', 500, 200, '32px sans-serif');
