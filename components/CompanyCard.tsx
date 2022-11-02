import {Key} from 'react';
import Image, {StaticImageData} from 'next/image';
import {plainCard} from '../assets/images/images';
import Link from 'next/link';

interface CompanyCardProps {
  id: Key | null | undefined;
  attributes: {
    name: string;
    pages: [
      {
        image_url: StaticImageData;
      },
    ];
    description: string;
    slug: string;
  };
}

interface allCompanies {
  companies: CompanyCardProps[];
}

function Card({attributes}: CompanyCardProps) {
  const {name, pages, description, slug} = attributes;
  return (
    <Link
      href={`/companies/${slug?.toLowerCase()}`}
      className="flex flex-col gap-5 py-14"
    >
      <a className="flex flex-col gap-5 py-14">
        <h2 className="text-lg font-medium text-grey">{name}</h2>
        <div className="relative">
          {pages[0].image_url ? (
            <Image
              alt="wise"
              src={pages[0].image_url}
              width={620}
              height={411}
              layout="responsive"
              placeholder="blur"
              objectFit="cover"
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
              objectFit="cover"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xg8AAnMBeJQW2OIAAAAASUVORK5CYII="
              className="rounded-2xl"
            />
          )}
        </div>
        <p className="text-body">{description}</p>
      </a>
    </Link>
  );
}

export default function CompanyCard({companies}: allCompanies) {
  return (
    <article className="grid grid-cols-2 gap-x-12 px-3">
      {companies?.map(company => (
        <Card key={company.id} {...company} />
      ))}
    </article>
  );
}
