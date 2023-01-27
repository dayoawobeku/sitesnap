import {useEffect, useRef, useState} from 'react';
import type {GetServerSideProps, NextPage} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import Image, {StaticImageData} from 'next/image';
import axios from 'axios';
import {dehydrate, QueryClient, useQuery} from '@tanstack/react-query';
import {closeIc, hyperlink, nextIc, prevIc} from '../../assets/images';
import {getCompany} from '../../queryfns';
import {Card, Modal} from '../../components';
import {slugify} from '../../utils/helpers';
import {ogImage, url} from '../../utils/constants';

interface Company {
  attributes: {
    slug: string;
  };
}

interface Page {
  page_name: string;
  page_url: string;
  image_url: StaticImageData;
  thumbnail_url: StaticImageData;
  company_name: string;
  page_id: string;
}

interface PreviewData {
  data: [
    {
      attributes: {
        name: string;
        pages: Page[];
        url: string;
      };
    },
  ];
}

const Company: NextPage<{
  preview: boolean;
  previewData: PreviewData;
}> = ({previewData, preview}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const {data: company} = useQuery({
    queryKey: ['company', router.query.id],
    queryFn: () => getCompany(router.query.id),
  });
  const pagesArray =
    company?.data[0]?.attributes?.pages ||
    previewData?.data[0]?.attributes?.pages;

  // get active page
  const activePage = pagesArray?.find(
    (page: Page) =>
      slugify(page.page_name) === router.query.page &&
      page.page_id === router.query.page_id,
  );

  // get the index of the active page
  const activePageIndex = pagesArray?.findIndex(
    (page: Page) =>
      slugify(page.page_name) === router.query.page &&
      page.page_id === router.query.page_id,
  );

  // get the next page
  function getNextPage() {
    if (activePageIndex === pagesArray?.length - 1) {
      const firstPage = pagesArray?.find(
        (page: Page, index: number) => index === 0,
      );
      const firstPageName = slugify(firstPage?.page_name);
      router.push(
        {
          pathname: `/companies/${router.query.id}`,
          query: {
            page: firstPageName,
            page_id: firstPage?.page_id,
          },
        },
        undefined,
        {
          shallow: true,
          scroll: false,
        },
      );
      return;
    } else {
      const nextPage = pagesArray?.find(
        (page: Page, index: number) => index === activePageIndex + 1,
      );
      const nextPageName = slugify(nextPage?.page_name);
      router.push(
        {
          pathname: `/companies/${router.query.id}`,
          query: {
            page: nextPageName,
            page_id: nextPage?.page_id,
          },
        },
        undefined,
        {
          shallow: true,
          scroll: false,
        },
      );
      return nextPage;
    }
  }

  // get the previous page
  function getPrevPage() {
    if (activePageIndex === 0) {
      const lastPage = pagesArray?.find(
        (page: Page, index: number) => index === pagesArray?.length - 1,
      );
      const lastPageName = slugify(lastPage?.page_name);
      router.push(
        {
          pathname: `/companies/${router.query.id}`,
          query: {
            page: lastPageName,
            page_id: lastPage?.page_id,
          },
        },
        undefined,
        {
          shallow: true,
          scroll: false,
        },
      );
      return;
    } else {
      const prevPage = pagesArray?.find(
        (page: Page, index: number) => index === activePageIndex - 1,
      );
      const prevPageName = slugify(prevPage?.page_name);
      router.push(
        {
          pathname: `/companies/${router.query.id}`,
          query: {
            page: prevPageName,
            page_id: prevPage?.page_id,
          },
        },
        undefined,
        {
          shallow: true,
          scroll: false,
        },
      );
      return prevPage;
    }
  }

  // get the next page on keydown
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowRight') {
      getNextPage();
    }
    if (e.key === 'ArrowLeft') {
      getPrevPage();
    }
  }

  // persist the page state (url) on refresh
  useEffect(() => {
    if (router.query.page && router.query.page_id) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [router.query.page, router.query.page_id]);

  // when the user switches pages, scroll to the top of the page
  const pageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (router.query.page && router.query.page_id && pageRef.current) {
      pageRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [router.query.page, router.query.page_id]);

  function openModal(page: Page) {
    setIsOpen(true);
    router.push(
      {
        pathname: `/companies/${router.query.id}`,
        query: {
          page: slugify(page.page_name),
          page_id: page.page_id,
        },
      },
      undefined,
      {
        shallow: true,
        scroll: false,
      },
    );
  }

  const metaTitle = company?.data[0]?.attributes?.name.toLowerCase();

  const [currentPage] = useState(0);
  const data = {
    data: pagesArray,
    meta: {
      pagination: {
        page: currentPage + 1,
        pageCount: Math.ceil(pagesArray?.length / 60),
        pageSize: 60,
        total: pagesArray?.length,
      },
    },
  };

  const PER_PAGE = 60;
  const offset = currentPage * PER_PAGE;
  // const currentPageData = data?.data
  //   ?.slice(offset, offset + PER_PAGE)
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   .map(({text}: any, index: number) => <p key={index}>{text}</p>);
  // const pageCount = Math.ceil(data?.meta?.pagination?.total / PER_PAGE);

  return (
    <>
      <Head>
        <title>{`${metaTitle} - sitesnap.design`}</title>
        <meta
          name="title"
          property="og:title"
          content={`${metaTitle} - sitesnap.design`}
        />
        <meta
          name="description"
          content="Find your favorite sites in one place, then learn from the greats."
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="canonical"
          href={`${url}/companies/${router.query.id}`}
          key="canonical"
        />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`${url}/companies/${router.query.id}`}
        />
        <meta property="og:title" content={`${metaTitle} - sitesnap.design`} />
        <meta
          name="description"
          property="og:description"
          content="Find your favorite sites in one place, then learn from the greats."
        />
        <meta property="og:site_name" content="sitesnap.design" />
        <meta name="image" property="og:image" content={ogImage} />
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content={`${url}/companies/${router.query.id}`}
        />
        <meta property="twitter:site" content="@sitesnap" />
        <meta
          property="twitter:title"
          content={`${metaTitle} - sitesnap.design`}
        />
        <meta
          property="twitter:description"
          content="Find your favorite sites in one place, then learn from the greats."
        />
        <meta property="twitter:image" content={ogImage} />
      </Head>

      {preview ? (
        <div className="my-4 w-fit text-blue">
          <span>You are currently viewing in Preview Mode.</span> {''}
          <button
            className="font-bold text-[#A13E3F] underline"
            onClick={() => exitPreviewMode()}
          >
            Turn Off Preview Mode
          </button>
        </div>
      ) : (
        ''
      )}

      <section className="flex flex-col items-start justify-between gap-4 py-16 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="text-lg font-medium text-grey md:text-xl">
          {company?.data[0]?.attributes?.name ||
            previewData?.data[0]?.attributes?.name}
        </h1>
        <a
          href={
            company?.data[0]?.attributes?.url ||
            previewData?.data[0]?.attributes?.url
          }
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-lg bg-white-200 p-4 font-medium outline outline-1 outline-body transition-all hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue"
        >
          <Image alt="" src={hyperlink} width={20} height={20} />
          visit website
        </a>
      </section>

      <Modal
        className="h-full max-w-[1199px] bg-white"
        transitionParentClassName="p-4"
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          router.push(`/companies/${router.query.id}`, undefined, {
            shallow: true,
            scroll: false,
          });
        }}
        onKeyDown={handleKeyDown}
      >
        <div className="flex flex-wrap items-center justify-center gap-3 bg-white p-4 sm:flex-nowrap sm:justify-between sm:gap-0 sm:py-8 sm:px-12">
          <p className="font-medium text-body">
            {company?.data[0]?.attributes?.name ||
              previewData?.data[0]?.attributes?.name}
          </p>
          <p className="font-medium text-body">
            {activePage?.page_name ?? '-'}
          </p>
          <div className="flex items-center gap-6">
            <button onClick={getPrevPage} className="h-6 w-6">
              <Image alt="prev" src={prevIc} width={24} height={24} />
            </button>
            <button onClick={getNextPage} className="h-6 w-6">
              <Image alt="next" src={nextIc} width={24} height={24} />
            </button>
            <div className="h-4 w-[1px] bg-[#D6D1CA]" />
            <button
              onClick={() => {
                setIsOpen(false);
                router.push(`/companies/${router.query.id}`, undefined, {
                  shallow: true,
                  scroll: false,
                });
              }}
              className="h-6 w-6"
            >
              <Image alt="close" src={closeIc} width={24} height={24} />
            </button>
          </div>
        </div>
        <div ref={pageRef} className="full-width-img relative h-full w-full">
          {activePage ? (
            <Image
              alt={activePage?.page_name}
              src={activePage?.image_url}
              layout="fill"
              objectFit="contain"
              objectPosition="top"
              tabIndex={0}
            />
          ) : null}
        </div>
      </Modal>

      <section className="card">
        {data?.data
          ?.slice(offset, offset + PER_PAGE)
          ?.map((page: Page, index: number) => (
            <article
              key={index}
              className="flex flex-col gap-4 py-0 md:gap-5 lg:py-14"
            >
              <h2 className="text-md-small font-medium text-grey md:text-md">
                {page?.page_name}
              </h2>
              <Card
                src={page?.thumbnail_url}
                alt={`${page?.company_name}-${page?.page_name}`}
                image_data={page?.thumbnail_url}
                onClick={() => openModal(page)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    openModal(page);
                  }
                }}
              />
            </article>
          ))}
      </section>
      {/* <Pagination
        pageCount={pageCount}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        currentPageData={currentPageData}
      /> */}
    </>
  );
};

export default Company;

export const getServerSideProps: GetServerSideProps = async ({
  params,
  preview,
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['company', params?.id], () =>
    getCompany(params?.id),
  );
  const previewData = await axios
    .get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/companies/?${
        preview ? 'publicationState=preview' : ''
      }&filters[slug][$eq]=${params?.id}`,
    )
    .then(res => res.data);

  if (previewData.data.length === 0) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      previewData,
      preview: preview ? true : null,
    },
  };
};

async function exitPreviewMode() {
  const response = await axios.get('/api/exit-preview');
  if (response) {
    window.location.reload();
  }
}
