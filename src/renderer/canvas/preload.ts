import {ImageListObject} from '../../types/types';

export default {
  imageList(list: string[]): ImageListObject {
    const images: ImageListObject = {};
    for (let i = 0; i < list.length; i++) {
      const image = new Image();
      image.onload = async () => {
        images[list[i]] = await createImageBitmap(image);
      };
      image.src = list[i];
    }
    return images;
  },
  getImageSublist(list: ImageListObject, ids: string[]): ImageListObject {
    const newList: ImageListObject = {};
    for (const [key, value] of Object.entries(list)) {
      if (ids.find(arrkey => arrkey === key)) {
        newList[key] = value;
      }
    }
    return newList;
  },
};
