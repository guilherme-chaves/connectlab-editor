import loadImage from '@connectlab-editor/functions/preloadImage';
import {ImageListObject} from '@connectlab-editor/types/common';

const imageList = import.meta.glob('/src/assets/gates/*.svg');

export default function preloadNodeImages(): ImageListObject {
  const images: ImageListObject = {};
  for (const path in imageList) {
    loadImage(path).then(image => (images[path] = image));
  }
  return images;
}
