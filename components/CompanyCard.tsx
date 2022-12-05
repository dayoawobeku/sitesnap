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

export default function CompanyCard({companies}: allCompanies) {
  return (
    <article className="card lg:px-3">
      {companies?.map(({attributes}) => (
        <Link
          href={`/companies/${attributes.slug?.toLowerCase()}`}
          key={attributes.slug}
          as={`/companies/${attributes.slug?.toLowerCase()}`}
        >
          <a className="flex flex-col gap-5 py-0 lg:py-14">
            <h2 className="text-md font-medium text-grey md:text-lg">
              {attributes.name}
            </h2>
            <Card
              src={attributes.pages[0]?.image_url}
              alt=""
              image_data={attributes.pages[0]?.image_url}
            />
            <p className="text-body">{attributes.description}</p>
          </a>
        </Link>
      ))}
    </article>
  );
}
