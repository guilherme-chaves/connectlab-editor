import {ImageListObject} from '@connectlab-editor/types';

/**
 * Função que carrega um ou mais arrays contendo um par de chave da imagem e caminho para o arquivo,
 * retornando um objeto contendo uma lista de objetos, com a chave de nome especificado.
 * @argument list Array de strings com a localização das imagens
 * @returns Lista dos bitmaps das imagens carregadas, tendo como chave a localização da imagem, passada no array do parâmetro
 */
export default function preloadImage(list: string[]): ImageListObject {
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
  imageList?: ImageListObject,
  imgPaths?: string[]
): ImageListObject | undefined {
  if (
    imageList === undefined ||
    imgPaths === undefined ||
    imgPaths.length === 0
  )
    return undefined;
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
