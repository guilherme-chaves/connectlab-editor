import { v4 as uuidv4 } from 'uuid';
import Editor from '@connectlab-editor/editor';
import ModalController from './modal';

new ModalController(
  'app-modal-tutorial',
  'tutorial-button',
  'app-modal-close',
  'app-tutorial-skip',
  'app-tutorial-next',
  'app-tutorial-previous',
  'app-tutorial-close',
);
const canvas = document.getElementById('editor-canvas')! as HTMLCanvasElement;
const bg = document.getElementById('background-canvas')! as HTMLCanvasElement;
new Editor(uuidv4(), 'Teste', canvas, bg);
