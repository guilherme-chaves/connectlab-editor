import { v4 as uuidv4 } from 'uuid';
import './style.css';
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
new Editor(uuidv4(), 'Teste', 'editor-canvas', 'background-canvas');
