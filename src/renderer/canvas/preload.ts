import {ImageListObject} from '../../types/types';

export default {
  imageList(list: string[]) {
    const images: ImageListObject = new Map();
    for (let i = 0; i < list.length; i++) {
      const image = new Image();
      image.onload = async () => {
        images.set(list[i], await createImageBitmap(image));
      };
      image.src = list[i];
    }
    return images;
  },
  getImageSublist(list: ImageListObject, ids: string[]): ImageListObject {
    const newList: ImageListObject = new Map();
    for (const [key, value] of list.entries()) {
      if (ids.find(arrkey => arrkey === key)) {
        newList.set(key, value);
      }
    }
    return newList;
  },
};
