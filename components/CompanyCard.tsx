import {Key} from 'react';
import {StaticImageData} from 'next/image';
import Link from 'next/link';
import Card from './Card';

interface CompanyCardProps {
  id: Key | null | undefined;
  attributes: {
    name: string;
    publishedAt: string;
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
  // recent companies will have a tag of 'just added'
  const recentCompanies = companies?.filter(
    company =>
      new Date(company.attributes.publishedAt) >
      new Date(Date.now() - 24 * 60 * 60 * 1000),
  );

  return (
    <article className="card-with-smaller-imgs lg:px-3">
      {companies?.map(({attributes}) => (
        <Link
          href={`/companies/${attributes.slug?.toLowerCase()}`}
          key={attributes.slug}
        >
          <a className="flex flex-col gap-4 py-0 lg:py-8">
            {recentCompanies?.find(
              company => company.attributes.slug === attributes.slug,
            ) ? (
              <div className="flex items-center gap-3">
                <h2 className="text-md-small font-medium text-grey">
                  {attributes.name}
                </h2>
                <div className="w-fit rounded-full bg-blue py-1 px-2 text-[0.625rem] font-medium uppercase leading-[8.87px] text-white">
                  just added
                </div>
              </div>
            ) : (
              <h2 className="text-md-small font-medium text-grey">
                {attributes.name}
              </h2>
            )}

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
