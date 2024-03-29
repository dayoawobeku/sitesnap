import {useState} from 'react';
import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import type {GetServerSideProps, NextPage} from 'next';
import Head from 'next/head';
import {dehydrate, QueryClient, useQuery} from '@tanstack/react-query';
import {getPaginatedCompanies} from '../queryfns';
import {ogImage, url} from '../utils/constants';
const Pagination = dynamic(() => import('../components/Pagination'));
const CompanyCard = dynamic(() => import('../components/CompanyCard'));

const Homepage: NextPage = () => {
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
        <title>
          Find your favorite sites in one place, then learn from the greats.
        </title>
        <meta
          name="title"
          property="og:title"
          content="Find your favorite sites in one place, then learn from the greats."
        />
        <meta
          name="description"
          content="Seek inspiration for web design at Sitesnap! Explore our curated collection of innovative African websites, fueling creativity for designers & developers."
        />
        <link rel="icon" href="/favicon.png" />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta
          property="og:title"
          content="Find your favorite sites in one place, then learn from the greats."
        />
        <meta
          name="description"
          property="og:description"
          content="Seek inspiration for web design at Sitesnap! Explore our curated collection of innovative African websites, fueling creativity for designers & developers."
        />
        <meta property="og:site_name" content="sitesnap.design" />
        <meta name="image" property="og:image" content={ogImage} />
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={url} />
        <meta property="twitter:site" content="@sitesnap" />
        <meta
          property="twitter:title"
          content="Find your favorite sites in one place, then learn from the greats."
        />
        <meta
          property="twitter:description"
          content="Seek inspiration for web design at Sitesnap! Explore our curated collection of innovative African websites, fueling creativity for designers & developers."
        />
        <meta property="twitter:image" content={ogImage} />
      </Head>

      <section className="mx-auto my-6 max-w-[1015px] py-4 text-center lg:my-0 lg:py-20">
        <h1 className="text-[1.875rem] font-bold text-grey lg:text-2xl">
          Find your favorite sites in one place, then learn from the greats.
        </h1>
        <p className="mx-auto mt-6 mb-2 max-w-[852px] px-[11px] text-base font-medium text-body sm:px-0 lg:text-md">
          Seek inspiration for web design at Sitesnap! Explore our curated
          collection of innovative African websites, fueling creativity for
          designers & developers.
        </p>
        <p className="text-base font-medium text-blue lg:text-md">
          *No account needed
        </p>
      </section>

      <section>
        <CompanyCard companies={companies?.data} />
        <Pagination
          pageCount={pageCount}
          currentPageData={currentPageData}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </section>
    </>
  );
};

export default Homepage;

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
