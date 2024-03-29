import {ImageListObject} from '../types/types';

/**
 * Função que carrega um ou mais arrays contendo um par de chave da imagem e caminho para o arquivo,
 * retornando um objeto contendo uma lista de objetos, com a chave de nome especificado.
 * @argument Array(s) com chave da imagem e caminho (path) da imagem, no formato [chave, chaminho]
 * @returns Objeto com a lista de imagens
 */
export default function preloadImage(list: string[]) {
  const images: ImageListObject = {};
  for (const key of list) {
    const image = new Image();
    image.onload = () => {
      Promise.all([createImageBitmap(image)]).then(bitmap => {
        images[key] = bitmap[0];
      });
    };
    image.src = key;
  }
  return images;
}

export function getImageSublist(
  imageList: ImageListObject,
  imgPaths: string[]
): ImageListObject {
  const subArr: ImageListObject = {};
  let i = 0;
  for (const path of imgPaths) {
    if (Object.keys(imageList).includes(path)) {
      subArr[i] = imageList[path];
      i++;
    }
  }
  return subArr;
}
