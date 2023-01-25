import React from 'react';
import Link from 'next/link';
import {StaticImageData} from 'next/image';
import {slugify} from '../utils/helpers';
import Card from './Card';

interface Company {
  id: string;
  attributes: {
    pages: [
      {
        thumbnail_url: StaticImageData;
      },
    ];
    industry: string;
  };
}

export default function IndustriesCard({industries}: {industries: Company[]}) {
  return (
    <article className="card lg:px-3">
      {industries?.map((company: Company) => (
        <Link
          key={company && company.id}
          href={`/industries/${slugify(company?.attributes?.industry)}`}
        >
          <a className="flex flex-col gap-4 py-0 md:gap-5 lg:py-14">
            <h2 className="text-md-small font-medium text-grey md:text-md">
              {company?.attributes?.industry}
            </h2>
            <Card
              src={company?.attributes?.pages[0].thumbnail_url}
              image_data={company?.attributes?.pages[0].thumbnail_url}
              alt={company?.attributes?.industry}
            />
          </a>
        </Link>
      ))}
    </article>
  );
}
