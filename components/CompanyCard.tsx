import Image, {StaticImageData} from 'next/image';

interface CompanyCardProps {
  company_name: string;
  company_image: StaticImageData;
  description: string;
  id?: number;
}

interface allCompanies {
  companies: CompanyCardProps[];
}

function Card({company_name, company_image, description}: CompanyCardProps) {
  return (
    <div className="flex flex-col gap-5 py-14">
      <h2 className="text-grey text-lg font-medium">{company_name}</h2>
      <div className="relative">
        {company_image ? (
          <Image
            alt="wise"
            src={company_image}
            width={620}
            height={411}
            layout="responsive"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xg8AAnMBeJQW2OIAAAAASUVORK5CYII="
            className="rounded-2xl"
          />
        ) : null}
      </div>
      <p className="text-body">{description}</p>
    </div>
  );
}

export default function CompanyCard({companies}: allCompanies) {
  return (
    <div className="grid grid-cols-2 gap-x-12 px-3">
      {companies.map(company => (
        <Card key={company.id} {...company} />
      ))}
    </div>
  );
}
