import type {NextPage} from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';
import {plainCard} from '../../assets/images/images';
import {slugify} from '../../helpers';
import {getCompanies} from '../../queryfns';

function capitalizeFirstLetter(word: string) {
  return word?.charAt(0).toUpperCase() + word?.slice(1);
}

interface CardProps {
  company_name: string;
  image_url: string;
}

function Card({company_name, image_url}: CardProps) {
  return (
    <Link href={`/companies/${slugify(company_name)}`}>
      <a className="flex flex-col gap-5 py-14">
        <h2 className="text-md font-medium text-grey">{company_name}</h2>
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

interface Company {
  id: string;
  name: string;
  pages: {
    image_url: string;
  }[];
  attributes: {
    industry: string;
    name: string;
    slug: string;
  };
}

const IndividualIndustries: NextPage = () => {
  const router = useRouter();

  const {data: companies} = useQuery(['companies'], getCompanies);

  const industryName = router.query.id;

  const industryCompanies = companies?.data?.filter(
    (company: Company) =>
      company.attributes.industry.toLowerCase() === industryName,
  );

  const companiesList = industryCompanies?.map(
    (company: Company) => company.attributes,
  );

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="py-16">
        <h1 className="text-xl font-medium text-grey">
          {capitalizeFirstLetter(industryName as string)}
        </h1>
      </section>

      <section>
        <div className="grid grid-cols-2 gap-x-12 px-3">
          {companiesList?.map((company: Company, index: number) => (
            <Card
              key={index}
              company_name={company.name}
              image_url={company?.pages[0]?.image_url}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default IndividualIndustries;
