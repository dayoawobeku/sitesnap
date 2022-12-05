import type {NextPage} from 'next';
import Head from 'next/head';
import {StaticImageData} from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';
import {capitalizeFirstLetter, slugify} from '../../helpers';
import {getCompanies} from '../../queryfns';
import {Card, HeadingOne} from '../../components';

interface Company {
  id: string;
  name: string;
  pages: {
    image_url: StaticImageData;
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

      <HeadingOne text={capitalizeFirstLetter(industryName as string)} />

      <section>
        <div className="card lg:px-3">
          {companiesList?.map((company: Company, index: number) => (
            <Link key={index} href={`/companies/${slugify(company.name)}`}>
              <a className="flex flex-col gap-5 py-0 lg:py-14">
                <h2 className="text-md font-medium text-grey">
                  {company.name}
                </h2>
                <Card
                  src={company?.pages[0]?.image_url}
                  alt=""
                  image_data={company?.pages[0]?.image_url}
                />
              </a>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default IndividualIndustries;