import {useState} from 'react';
import type {GetServerSideProps, NextPage} from 'next';
import {useRouter} from 'next/router';
import Head from 'next/head';
import {dehydrate, QueryClient, useQuery} from '@tanstack/react-query';
import {getPaginatedCompanies} from '../../queryfns';
import {CompanyCard, HeadingOne, Pagination} from '../../components';
import {ogImage, url} from '../../utils/constants';

const Companies: NextPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const routerQueryPage = router.query.page ? Number(router.query.page) : 1;

  const {data: companies} = useQuery({
    queryKey: ['companies', routerQueryPage],
    queryFn: () => getPaginatedCompanies(routerQueryPage),
  });

  const PER_PAGE = 60;
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
          content="Seek inspiration for web design at Sitesnap! Explore our curated collection of innovative African websites, fueling creativity for designers & developers."
        />
        <link rel="icon" href="/favicon.ico" />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${url}/companies`} />
        <meta property="og:title" content="companies - sitesnap.design" />
        <meta
          name="description"
          property="og:description"
          content="Seek inspiration for web design at Sitesnap! Explore our curated collection of innovative African websites, fueling creativity for designers & developers."
        />
        <meta property="og:site_name" content="sitesnap.design" />
        <meta name="image" property="og:image" content={ogImage} />
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`${url}/companies`} />
        <meta property="twitter:site" content="@sitesnap" />
        <meta property="twitter:title" content="companies - sitesnap.design" />
        <meta
          property="twitter:description"
          content="Seek inspiration for web design at Sitesnap! Explore our curated collection of innovative African websites, fueling creativity for designers & developers."
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
