import React from 'react';
import Image, {StaticImageData} from 'next/image';
import {plainCard} from '../assets/images/images';

interface Props {
  src: StaticImageData;
  onClick?: () => void;
  image_data: StaticImageData;
  alt: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

export default function Card({
  src,
  onClick,
  image_data,
  alt,
  onKeyDown,
}: Props) {
  return (
    <>
      {image_data ? (
        <article className="relative w-full rounded border-[0.5px] border-body focus-within:border-blue lg:rounded-2xl">
          <Image
            alt={alt}
            src={src ?? plainCard}
            width={620}
            height={411}
            layout="responsive"
            objectFit="cover"
            objectPosition="top"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xg8AAnMBeJQW2OIAAAAASUVORK5CYII="
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
