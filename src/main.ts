import './style.css';
import Editor from './Editor';

const editor = new Editor('teste', 'editor-canvas', 'editor-background');

editor.text('Olá mundo', 500, 200, '32px sans-serif');
