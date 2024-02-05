import {ImageListObject} from '../../types/types';

export default {
  imageList(list: Map<number, string>) {
    const images: ImageListObject = new Map();
    list.forEach(async (value, key) => {
      const image = new Image();
      image.src = value;
      await image.decode();
      images.set(key, await createImageBitmap(image));
    });
    return images;
  },
};
