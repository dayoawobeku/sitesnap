import {useState} from 'react';
import type {GetServerSideProps, NextPage} from 'next';
import Head from 'next/head';
import {StaticImageData} from 'next/image';
import {dehydrate, QueryClient, useQuery} from '@tanstack/react-query';
import {getCompaniesByIndustry, getIndustries} from '../../queryfns';
import {HeadingOne, IndustriesCard, Pagination} from '../../components';
import {ogImage, url} from '../../utils/constants';

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
  const {data: industries} = useQuery({
    queryKey: ['industries'],
    queryFn: getIndustries,
  });
  const {data: companies} = useQuery({
    queryKey: ['companiesByIndustry'],
    queryFn: getCompaniesByIndustry,
  });
  const [currentPage, setCurrentPage] = useState(0);
  console.log(industries, 'industries');
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

  const sortedIndustries = uniqueIndustries?.sort((a: Company, b: Company) => {
    if (a?.attributes?.industry < b?.attributes?.industry) {
      return -1;
    }
    if (a?.attributes?.industry > b?.attributes?.industry) {
      return 1;
    }
    return 0;
  });

  const companiesByIndustry = sortedIndustries?.map((industry: Company) => {
    return companies?.data?.filter(
      (company: Company) =>
        company?.attributes?.industry === industry?.attributes?.industry,
    );
  });

  const randomCompanies = companiesByIndustry?.map((industry: Company[]) => {
    return industry?.sort(() => Math.random() - 0.5);
  });

  const flattenedCompanies = randomCompanies?.flat();

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

  console.log(uniqueCompanies, 'uniqueCompanies');

  const data = {
    data: uniqueCompanies,
    meta: {
      pagination: {
        page: currentPage + 1,
        pageCount: Math.ceil(uniqueCompanies?.length / 60),
        pageSize: 60,
        total: uniqueCompanies?.length,
      },
    },
  };

  const PER_PAGE = 60;
  const offset = currentPage * PER_PAGE;
  const currentPageData = data?.data
    ?.slice(offset, offset + PER_PAGE)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map(({text}: any, index: number) => <p key={index}>{text}</p>);
  const pageCount = Math.ceil(data?.meta?.pagination?.total / PER_PAGE);

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
          content="Seek inspiration for web design at Sitesnap! Explore our curated collection of innovative African websites, fueling creativity for designers & developers."
        />
        <link rel="icon" href="/favicon.png" />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${url}/industries`} />
        <meta property="og:title" content="industries - sitesnap.design" />
        <meta
          name="description"
          property="og:description"
          content="Seek inspiration for web design at Sitesnap! Explore our curated collection of innovative African websites, fueling creativity for designers & developers."
        />
        <meta property="og:site_name" content="sitesnap.design" />
        <meta name="image" property="og:image" content={ogImage} />
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`${url}/industries`} />
        <meta property="twitter:site" content="@sitesnap" />
        <meta property="twitter:title" content="industries - sitesnap.design" />
        <meta
          property="twitter:description"
          content="Seek inspiration for web design at Sitesnap! Explore our curated collection of innovative African websites, fueling creativity for designers & developers."
        />
        <meta property="twitter:image" content={ogImage} />
      </Head>

      <HeadingOne text="Industries" />

      <section>
        <IndustriesCard
          industries={data?.data?.slice(offset, offset + PER_PAGE)}
        />
        <Pagination
          pageCount={pageCount}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          currentPageData={currentPageData}
        />
      </section>
    </>
  );
};

export default Industries;

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery(['companiesByIndustry'], getCompaniesByIndustry),
    queryClient.prefetchQuery(['industries'], getIndustries),
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
