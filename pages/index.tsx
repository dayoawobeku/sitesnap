import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import type {GetServerSideProps, NextPage} from 'next';
import Head from 'next/head';
import {dehydrate, QueryClient, useQuery} from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import CompanyCard from '../components/CompanyCard';
import {getPaginatedCompanies} from '../queryfns';
import {ogImage, url} from '../helpers';

const Homepage: NextPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (router.query.page) {
      setCurrentPage(parseInt(router.query.page as string));
    } else {
      setCurrentPage(0);
    }
  }, [router.query.page]);

  const {data: companies} = useQuery(
    ['companies', router.query.page ? Number(router.query.page) : 1],
    () =>
      getPaginatedCompanies(router.query.page ? Number(router.query.page) : 1),
  );

  function handlePageClick(selectedPage: {selected: number}) {
    setCurrentPage(selectedPage.selected);
    router.push(`/?page=${selectedPage.selected + 1}`);
  }

  // pagination
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
        <title>sitesnap.design</title>
        <meta name="title" property="og:title" content="sitesnap.design" />
        <meta
          name="description"
          content="Find your favorite sites in one place, then learn from the greats."
        />
        <link rel="icon" href="/favicon.ico" />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content="sitesnap.design" />
        <meta
          name="description"
          property="og:description"
          content="Find your favorite sites in one place, then learn from the greats."
        />
        <meta property="og:site_name" content="sitesnap.design" />
        <meta name="image" property="og:image" content={ogImage} />
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={url} />
        {/* <meta property="twitter:site" content="@sitesnap_design" /> */}
        <meta property="twitter:title" content="sitesnap.design" />
        <meta
          property="twitter:description"
          content="Find your favorite sites in one place, then learn from the greats."
        />
        <meta property="twitter:image" content={ogImage} />
      </Head>

      <section className="mx-auto my-6 max-w-[922px] py-4 text-center lg:my-0 lg:py-20">
        <h1 className="text-[1.875rem] font-bold text-grey lg:text-2xl">
          Find your favorite sites in one place, then learn from the greats.
        </h1>
        <p className="mx-auto mt-6 mb-2 max-w-[852px] px-[11px] text-base font-medium text-body sm:px-0 lg:text-md">
          We track each of these sites and update our collection regularly to
          include the latest designs.
        </p>
        <p className="text-base font-medium text-blue lg:text-md">
          *No account needed
        </p>
      </section>

      <section>
        <CompanyCard companies={companies?.data} />

        <div className="flex items-end justify-center gap-7">
          <div className="flex py-6">
            <ReactPaginate
              previousLabel="Prev"
              nextLabel="Next"
              pageCount={pageCount}
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              forcePage={
                router.query.page ? Number(router.query.page) - 1 : currentPage
              }
              breakLabel="..."
              containerClassName="pagination"
              previousLinkClassName="pagination__link--prev"
              nextLinkClassName="pagination__link--next"
              disabledClassName="pagination__link--disabled"
              activeClassName="pagination__link--active"
            />
            {currentPageData}
          </div>
        </div>
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
