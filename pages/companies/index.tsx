import {useState} from 'react';
import type {GetServerSideProps, NextPage} from 'next';
import Head from 'next/head';
import {dehydrate, QueryClient, useQuery} from '@tanstack/react-query';
import {getPaginatedCompanies} from '../../queryfns';
import {CompanyCard, HeadingOne, Pagination} from '../../components';
import {ogImage, url} from '../../helpers';
import {useRouter} from 'next/router';

const Companies: NextPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);

  const {data: companies} = useQuery(
    ['companies', router.query.page ? Number(router.query.page) : 1],
    () =>
      getPaginatedCompanies(router.query.page ? Number(router.query.page) : 1),
  );

  const PER_PAGE = 8;
  const offset = currentPage * PER_PAGE;
  const currentPageData = companies?.data
    .slice(offset, offset + PER_PAGE)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map(({text}: any, index: number) => <p key={index}>{text}</p>);
  const pageCount = Math.ceil(companies?.meta?.pagination?.total / PER_PAGE);

  return (
    <>
      <Head>
        <title>companies - sitesnap.design</title>
        <meta
          name="title"
          property="og:title"
          content="companies - sitesnap.design"
        />
        <meta
          name="description"
          content="Find your favorite sites in one place, then learn from the greats."
        />
        <link rel="icon" href="/favicon.ico" />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${url}/companies`} />
        <meta property="og:title" content="companies - sitesnap.design" />
        <meta
          name="description"
          property="og:description"
          content="Find your favorite sites in one place, then learn from the greats."
        />
        <meta property="og:site_name" content="sitesnap.design" />
        <meta name="image" property="og:image" content={ogImage} />
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`${url}/companies`} />
        {/* <meta property="twitter:site" content="@sitesnap_design" /> */}
        <meta property="twitter:title" content="companies - sitesnap.design" />
        <meta
          property="twitter:description"
          content="Find your favorite sites in one place, then learn from the greats."
        />
        <meta property="twitter:image" content={ogImage} />
      </Head>

      <HeadingOne text="All companies" />

      <section>
        <CompanyCard companies={companies?.data} />
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

export default Companies;

export const getServerSideProps: GetServerSideProps = async params => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    ['companies', params.query.page ? Number(params.query.page) : 1],
    () =>
      getPaginatedCompanies(params.query.page ? Number(params.query.page) : 1),
  );
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
