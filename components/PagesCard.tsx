import {StaticImageData} from 'next/image';
import Link from 'next/link';
import {slugify} from '../helpers';
import Card from './Card';

interface PagesCardProps {
  page_name: string;
  image_url: StaticImageData;
  id?: number;
}

interface allPages {
  pages: PagesCardProps[];
}

export default function PagesCard({pages}: allPages) {
  return (
    <div className="card lg:px-3">
      {pages?.map(({page_name, image_url}, index) => (
        <Link key={index} href={`/webpages/${slugify(page_name)}`}>
          <a className="flex flex-col gap-5 py-0 lg:py-14">
            <h2 className="text-md font-medium text-grey">{page_name}</h2>
            <Card src={image_url} alt="" image_data={image_url} />
          </a>
        </Link>
      ))}
    </div>
  );
}
