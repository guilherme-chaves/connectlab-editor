import { v4 as uuidv4 } from 'uuid';
import './style.css';
import Editor from '@connectlab-editor/editor';

new Editor(uuidv4(), 'Teste', 'editor-canvas', 'background-canvas');
