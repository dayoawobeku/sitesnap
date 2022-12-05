import React from 'react';
import Image, {StaticImageData} from 'next/image';
import {plainCard} from '../assets/images/images';

interface Props {
  src: StaticImageData;
  onClick?: () => void;
  image_data: StaticImageData;
  alt: string;
}

export default function Card({src, onClick, image_data, alt}: Props) {
  return (
    <>
      {image_data ? (
        <div className="relative w-full rounded border-[0.5px] border-body lg:rounded-2xl">
          <Image
            alt={alt}
            src={src ?? plainCard}
            width={620}
            height={411}
            layout="responsive"
            objectFit="cover"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xg8AAnMBeJQW2OIAAAAASUVORK5CYII="
            className="cursor-pointer rounded-2xl"
            onClick={onClick}
          />
        </div>
      ) : null}
    </>
  );
}
