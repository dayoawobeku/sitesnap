import {Key} from 'react';
import {StaticImageData} from 'next/image';
import Link from 'next/link';
import Card from './Card';

interface CompanyCardProps {
  id: Key | null | undefined;
  attributes: {
    name: string;
    pages: [
      {
        thumbnail_url: StaticImageData;
      },
    ];
    description: string;
    slug: string;
  };
}

interface allCompanies {
  companies: CompanyCardProps[];
}

export default function CompanyCard({companies}: allCompanies) {
  return (
    <article className="card-with-smaller-imgs lg:px-3">
      {companies?.map(({attributes}) => (
        <Link
          href={`/companies/${attributes.slug?.toLowerCase()}`}
          key={attributes.slug}
        >
          <a className="flex flex-col gap-4 py-0 lg:py-8">
            <h2 className="text-md-small font-medium text-grey">
              {attributes.name}
            </h2>
            <Card
              src={attributes.pages[0]?.thumbnail_url}
              alt=""
              image_data={attributes.pages[0]?.thumbnail_url}
            />
            <p className="truncated-text text-body">{attributes.description}</p>
          </a>
        </Link>
      ))}
    </article>
  );
}
