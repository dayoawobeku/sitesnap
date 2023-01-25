import {StaticImageData} from 'next/image';
import Link from 'next/link';
import {slugify} from '../utils/helpers';
import Card from './Card';

interface PagesCardProps {
  page_name: string;
  thumbnail_url: StaticImageData;
  id?: number;
}

interface allPages {
  pages: PagesCardProps[];
}

export default function PagesCard({pages}: allPages) {
  return (
    <div className="card lg:px-3">
      {pages?.map(({page_name, thumbnail_url}, index) => (
        <Link key={index} href={`/webpages/${slugify(page_name)}`}>
          <a className="flex flex-col gap-4 py-0 md:gap-5 lg:py-14">
            <h2 className="text-md-small font-medium text-grey md:text-md">
              {page_name}
            </h2>
            <Card src={thumbnail_url} alt="" image_data={thumbnail_url} />
          </a>
        </Link>
      ))}
    </div>
  );
}
