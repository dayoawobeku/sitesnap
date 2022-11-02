import Image, {StaticImageData} from 'next/image';
import {plainCard} from '../assets/images/images';

interface PagesCardProps {
  page_name: string;
  image_url: StaticImageData;
  id?: number;
}

interface allPages {
  pages: PagesCardProps[];
}

function Card({page_name, image_url}: PagesCardProps) {
  return (
    <div className="flex flex-col gap-5 py-14">
      <h2 className="text-md font-medium text-grey">{page_name}</h2>
      <div className="relative">
        {image_url ? (
          <Image
            alt="wise"
            src={image_url}
            width={620}
            height={411}
            layout="responsive"
            objectFit="cover"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xg8AAnMBeJQW2OIAAAAASUVORK5CYII="
            className="rounded-2xl"
          />
        ) : (
          <Image
            alt="wise"
            src={plainCard}
            width={620}
            height={411}
            layout="responsive"
            placeholder="blur"
            objectFit="cover"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xg8AAnMBeJQW2OIAAAAASUVORK5CYII="
            className="rounded-2xl"
          />
        )}
      </div>
    </div>
  );
}

export default function PagesCard({pages}: allPages) {
  return (
    <div className="grid grid-cols-2 gap-x-12 px-3">
      {pages?.map(page => (
        <Card key={page.id} {...page} />
      ))}
    </div>
  );
}
