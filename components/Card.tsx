import React, {useEffect} from 'react';
import Image, {StaticImageData} from 'next/image';
import {plainCard} from '../assets/images';

interface Props {
  src: string | StaticImageData;
  onClick?: () => void;
  image_data: string | StaticImageData;
  alt: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  cardWidth?: number;
  cardHeight?: number;
}

export default function Card({
  src,
  onClick,
  image_data,
  alt,
  onKeyDown,
  cardWidth,
  cardHeight,
}: Props) {
  // function to replace the blurDataURL with a blurred image of the src from cloudinary
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function blurImage(src: any) {
    if (src) {
      const blurImage = src.replace(
        'upload/e_sharpen:100,q_auto,f_auto,w_620,h_411,c_thumb,g_north/',
        'upload/e_blur:400,q_auto,f_auto,w_620,h_411,c_thumb,g_north/',
      );
      return blurImage;
    }
  }

  const [isBrowser, setIsBrowser] = React.useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  return (
    <>
      {image_data ? (
        <article className="relative w-full rounded border-[0.5px] border-body focus-within:border-blue hover:border-blue lg:rounded-2xl">
          <Image
            alt={alt}
            src={src ?? plainCard}
            width={cardWidth ?? 310}
            height={cardHeight ?? 199}
            layout="responsive"
            objectFit="cover"
            objectPosition="top"
            placeholder="blur"
            blurDataURL={
              isBrowser
                ? blurImage(src)
                : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xg8AAnMBeJQW2OIAAAAASUVORK5CYII='
            }
            className="cursor-pointer rounded lg:rounded-2xl"
            onClick={onClick}
            tabIndex={typeof onClick === 'function' ? 0 : -1}
            onKeyDown={onKeyDown}
          />
        </article>
      ) : null}
    </>
  );
}
