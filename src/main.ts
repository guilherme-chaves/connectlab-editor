import './style.css';
import Editor from './Editor';
import {RendererType} from './types/types';

const editor = new Editor(
  'teste',
  'editor-canvas',
  'editor-background',
  RendererType.GL
);

editor.text('Olá mundo', 500, 200, '32px sans-serif');
