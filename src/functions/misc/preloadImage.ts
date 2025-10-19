import { ImageListObject } from '@connectlab-editor/types/common';

/**
 * Função que carrega um ou mais arrays contendo um par de chave da imagem e caminho para o arquivo,
 * retornando um objeto contendo uma lista de objetos, com a chave de nome especificado.
 * @argument list Array de strings com a localização das imagens
 * @returns Lista dos bitmaps das imagens carregadas,
 *  tendo como chave a localização da imagem, passada no array do parâmetro
 */
export default async function loadImage(src: string): Promise<ImageBitmap> {
  const image = new Image();
  image.src = src;
  await image.decode();
  return window.createImageBitmap(image);
}

export function getImageSublist(
  imageList: ImageListObject,
  imgPaths: string[],
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
