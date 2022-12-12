import type {GetStaticProps, NextPage} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {StaticImageData} from 'next/image';
import {dehydrate, QueryClient, useQuery} from '@tanstack/react-query';
import {getCompanies} from '../../queryfns/getCompanies';
import {ogImage, slugify, url} from '../../helpers';
import {Card, HeadingOne} from '../../components';

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
  const {data: companies} = useQuery(['companies'], getCompanies);

  const randomCompanies = companies?.data?.sort(() => Math.random() - 0.5);

  // sort the random companies according to the industry name
  const sortedCompanies = randomCompanies.sort((a: Company, b: Company) => {
    if (a?.attributes?.industry < b?.attributes?.industry) {
      return -1;
    }
    if (a?.attributes?.industry > b?.attributes?.industry) {
      return 1;
    }
    return 0;
  });

  const uniqueCompanies = sortedCompanies?.filter(
    (company: Company, index: number, self: Company[]) => {
      return (
        index ===
        self.findIndex(
          t => t?.attributes?.industry === company?.attributes?.industry,
        )
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
            key={company.id}
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
  await queryClient.prefetchQuery(['companies'], getCompanies);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
