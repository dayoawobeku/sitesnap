import {useEffect, useState} from 'react';
import type {GetStaticProps, NextPage} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {StaticImageData} from 'next/image';
import {dehydrate, QueryClient, useQuery} from '@tanstack/react-query';
import {getCompanies} from '../../queryfns/getCompanies';
import {slugify} from '../../helpers';
import {Card, HeadingOne} from '../../components';

interface Company {
  id: string;
  attributes: {
    pages: [
      {
        page_name: string;
        page_id: string;
        image_url: StaticImageData;
      },
    ];
    industry: string;
    name: string;
    slug: string;
  };
}

const Industries: NextPage = () => {
  const {data: companies} = useQuery(['companies'], getCompanies);
  const [firstCompanies, setFirstCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const randomCompanies = companies?.data?.sort(() => Math.random() - 0.5);

    const uniqueIndustries = [
      ...new Set(
        randomCompanies?.map((company: Company) => company.attributes.industry),
      ),
    ];

    // first set of company that has those industries
    const firstCompanies = uniqueIndustries.map(industry => {
      const firstCompany = companies?.data?.find(
        (company: Company) => company.attributes.industry === industry,
      );

      return firstCompany;
    });

    setFirstCompanies(firstCompanies);
  }, [companies]);

  // randomize the companies

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HeadingOne text="Industries" />

      <article className="card lg:px-3">
        {firstCompanies?.map(company => (
          <Link
            key={company.id}
            href={`/industries/${slugify(company?.attributes?.industry)}`}
          >
            <a className="flex flex-col gap-5 py-0 lg:py-14">
              <h2 className="text-md font-medium text-grey md:text-lg">
                {company?.attributes?.industry}
              </h2>
              <Card
                src={company?.attributes?.pages[0].image_url}
                image_data={company?.attributes?.pages[0].image_url}
                alt={company?.attributes?.industry}
              />
            </a>
          </Link>
        ))}
      </article>
    </>
  );
};

export default Industries;

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['companies'], getCompanies);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
