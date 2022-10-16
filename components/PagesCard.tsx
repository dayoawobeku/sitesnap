import Image, {StaticImageData} from 'next/image';

interface PagesCardProps {
  page_name: string;
  page_image: StaticImageData;
  id?: number;
}

interface allPages {
  pages: PagesCardProps[];
}

function Card({page_name, page_image}: PagesCardProps) {
  return (
    <div className="flex flex-col gap-5 py-14">
      <h2 className="text-grey text-md font-medium">{page_name}</h2>
      <div className="relative">
        {page_image ? (
          <Image
            alt="wise"
            src={page_image}
            width={620}
            height={411}
            layout="responsive"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xg8AAnMBeJQW2OIAAAAASUVORK5CYII="
            className="rounded-2xl"
          />
        ) : null}
      </div>
    </div>
  );
}

export default function PagesCard({pages}: allPages) {
  return (
    <div className="grid grid-cols-2 gap-x-12 px-3">
      {pages.map(page => (
        <Card key={page.id} {...page} />
      ))}
    </div>
  );
}
