import type {GetStaticProps, NextPage} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {StaticImageData} from 'next/image';
import {dehydrate, QueryClient, useQuery} from '@tanstack/react-query';
import {getCompanies} from '../../queryfns/getCompanies';
import {ogImage, slugify, url} from '../../helpers';
import {Card, HeadingOne} from '../../components';
import {getIndustries} from '../../queryfns';

interface Company {
  id: string;
  attributes: {
    pages: [
      {
        page_name: string;
        page_id: string;
        thumbnail_url: StaticImageData;
      },
    ];
    industry: string;
    name: string;
    slug: string;
  };
}

const Industries: NextPage = () => {
  const {data: industries} = useQuery(['industries'], getIndustries);
  const {data: companies} = useQuery(['companies'], getCompanies);

  // find the unique industries
  const uniqueIndustries = industries?.data?.filter(
    (industry: Company, index: number) => {
      return (
        industries?.data?.findIndex(
          (i: Company) =>
            i?.attributes?.industry === industry?.attributes?.industry,
        ) === index
      );
    },
  );

  // sort the industries alphabetically

  const sortedIndustries = uniqueIndustries?.sort((a: Company, b: Company) => {
    if (a?.attributes?.industry < b?.attributes?.industry) {
      return -1;
    }
    if (a?.attributes?.industry > b?.attributes?.industry) {
      return 1;
    }
    return 0;
  });

  // find the companies that match the industry

  const companiesByIndustry = sortedIndustries?.map((industry: Company) => {
    return companies?.data?.filter(
      (company: Company) =>
        company?.attributes?.industry === industry?.attributes?.industry,
    );
  });

  // get a random company from each industry
  const randomCompanies = companiesByIndustry?.map((industry: Company[]) => {
    return industry?.sort(() => Math.random() - 0.5);
  });

  const flattenedCompanies = randomCompanies?.flat();

  // get only 1 company from each industry

  const uniqueCompanies = flattenedCompanies?.filter(
    (company: Company, index: number) => {
      return (
        flattenedCompanies?.findIndex(
          (i: Company) =>
            i?.attributes?.industry === company?.attributes?.industry,
        ) === index
      );
    },
  );

  return (
    <>
      <Head>
        <title>industries - sitesnap.design</title>
        <meta
          name="title"
          property="og:title"
          content="industries - sitesnap.design"
        />
        <meta
          name="description"
          content="Find your favorite sites in one place, then learn from the greats."
        />
        <link rel="icon" href="/favicon.ico" />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${url}/industries`} />
        <meta property="og:title" content="industries - sitesnap.design" />
        <meta
          name="description"
          property="og:description"
          content="Find your favorite sites in one place, then learn from the greats."
        />
        <meta property="og:site_name" content="sitesnap.design" />
        <meta name="image" property="og:image" content={ogImage} />
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`${url}/industries`} />
        {/* <meta property="twitter:site" content="@sitesnap_design" /> */}
        <meta property="twitter:title" content="industries - sitesnap.design" />
        <meta
          property="twitter:description"
          content="Find your favorite sites in one place, then learn from the greats."
        />
        <meta property="twitter:image" content={ogImage} />
      </Head>

      <HeadingOne text="Industries" />

      <article className="card lg:px-3">
        {uniqueCompanies?.map((company: Company) => (
          <Link
            key={company && company.id}
            href={`/industries/${slugify(company?.attributes?.industry)}`}
          >
            <a className="flex flex-col gap-5 py-0 lg:py-14">
              <h2 className="text-md font-medium text-grey md:text-lg">
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
    </>
  );
};

export default Industries;

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery(['companies'], getCompanies),
    queryClient.prefetchQuery(['industries'], getIndustries),
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
