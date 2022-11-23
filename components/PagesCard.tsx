import Image, {StaticImageData} from 'next/image';
import Link from 'next/link';
import {plainCard} from '../assets/images/images';
import {slugify} from '../helpers';

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
    <Link href={`/webpages/${slugify(page_name)}`}>
      <a className="flex flex-col gap-5 py-14">
        <h2 className="text-md font-medium text-grey">{page_name}</h2>
        <div className="relative">
          {image_url ? (
            <Image
              alt=""
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
              alt=""
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
      </a>
    </Link>
  );
}

export default function PagesCard({pages}: allPages) {
  return (
    <div className="grid grid-cols-2 gap-x-12 px-3">
      {pages?.map((page, index) => (
        <Card key={index} {...page} />
      ))}
    </div>
  );
}
