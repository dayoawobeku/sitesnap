import type {GetStaticPaths, GetStaticProps, NextPage} from 'next';
import Head from 'next/head';
import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/router';
import Image, {StaticImageData} from 'next/image';
import {dehydrate, QueryClient, useQuery} from '@tanstack/react-query';
import {getWebpages} from '../../queryfns';
import {Card, HeadingOne, Modal, Pagination} from '../../components';
import {closeIc, nextIc, prevIc} from '../../assets/images';
import {slugify} from '../../utils/helpers';
import {ogImage, url} from '../../utils/constants';
import Link from 'next/link';

interface Page {
  page_name: string;
  attributes: {
    pages: string[];
    name: string;
  };
  company_name: string;
  page_id: string;
  image_url: StaticImageData;
  thumbnail_url: StaticImageData;
}

const IndividualWebpages: NextPage = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const {data: webpages} = useQuery({
    queryKey: ['webpages', router.query.id],
    queryFn: getWebpages,
  });

  const pagesArray = webpages?.data?.map((page: Page) => page.attributes.pages);

  const flattenedPages = pagesArray?.flat();

  const specificPages = flattenedPages?.filter(
    (page: Page) => slugify(page.page_name) === router.query.id,
  );

  // get the company that is currently active
  const activePage = specificPages?.find(
    (page: Page) =>
      slugify(page.company_name) === router.query.company &&
      page.page_id === router.query.page_id,
  );

  // get the index of the active company
  const activePageIndex = specificPages?.findIndex(
    (page: Page) =>
      slugify(page.company_name) === router.query.company &&
      page.page_id === router.query.page_id,
  );

  // get the next company
  function getNextCompany() {
    if (activePageIndex === specificPages?.length - 1) {
      const firstCompany = specificPages?.find(
        (page: Page, index: number) => index === 0,
      );
      const firstCompanyName = slugify(firstCompany?.company_name);

      router.push(
        {
          pathname: `/webpages/${router.query.id}`,
          query: {
            company: firstCompanyName,
            page_id: firstCompany?.page_id,
          },
        },
        undefined,
        {shallow: true, scroll: false},
      );
      return;
    } else {
      const nextCompany = specificPages?.find(
        (page: Page, index: number) => index === activePageIndex + 1,
      );
      const nextCompanyName = slugify(nextCompany?.company_name);
      router.push(
        {
          pathname: `/webpages/${router.query.id}`,
          query: {
            company: nextCompanyName,
            page_id: nextCompany?.page_id,
          },
        },
        undefined,
        {shallow: true, scroll: false},
      );
      return nextCompany;
    }
  }

  // get the previous company
  function getPrevCompany() {
    if (activePageIndex === 0) {
      const lastCompany = specificPages?.find(
        (page: Page, index: number) => index === specificPages?.length - 1,
      );
      const lastCompanyName = slugify(lastCompany?.company_name);
      router.push(
        {
          pathname: `/webpages/${router.query.id}`,
          query: {
            company: lastCompanyName,
            page_id: lastCompany?.page_id,
          },
        },
        undefined,
        {shallow: true, scroll: false},
      );
      return;
    } else {
      const prevCompany = specificPages?.find(
        (page: Page, index: number) => index === activePageIndex - 1,
      );
      const prevCompanyName = slugify(prevCompany?.company_name);
      router.push(
        {
          pathname: `/webpages/${router.query.id}`,
          query: {
            company: prevCompanyName,
            page_id: prevCompany?.page_id,
          },
        },
        undefined,
        {shallow: true, scroll: false},
      );
      return prevCompany;
    }
  }

  // get the next page on keydown
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowRight') {
      getNextCompany();
    }
    if (e.key === 'ArrowLeft') {
      getPrevCompany();
    }
  }

  // persist the page state (url) on refresh
  useEffect(() => {
    if (router.query.company && router.query.page_id) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [router.query.company, router.query.page_id]);

  // when the user switches pages, scroll to the top of the page
  const pageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (router.query.company && router.query.page_id && pageRef.current) {
      pageRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [router.query.company, router.query.page_id]);

  function openModal(page: Page) {
    setIsOpen(true);
    router.push(
      {
        pathname: `/webpages/${router.query.id}`,
        query: {
          company: slugify(page.company_name),
          page_id: page.page_id,
        },
      },
      undefined,
      {shallow: true, scroll: false},
    );
  }

  const metaTitle = specificPages?.[0]?.page_name.toLowerCase();

  const [currentPage, setCurrentPage] = useState(0);
  const data = {
    data: specificPages,
    meta: {
      pagination: {
        page: currentPage + 1,
        pageCount: Math.ceil(specificPages?.length / 60),
        pageSize: 60,
        total: specificPages?.length,
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
        <title>{`webpages (${metaTitle}) - sitesnap.design`}</title>
        <meta
          name="title"
          property="og:title"
          content={`webpages (${metaTitle}) - sitesnap.design`}
        />
        <meta
          name="description"
          content="Seek inspiration for web design at Sitesnap! Explore our curated collection of innovative African websites, fueling creativity for designers & developers."
        />
        <link rel="icon" href="/favicon.png" />
        <link
          rel="canonical"
          href={`${url}/webpages/${router.query.id}`}
          key="canonical"
        />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`${url}/webpages/${router.query.id}`}
        />
        <meta
          property="og:title"
          content={`webpages (${metaTitle}) - sitesnap.design`}
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
        <meta
          property="twitter:url"
          content={`${url}/webpages/${router.query.id}`}
        />
        <meta property="twitter:site" content="@sitesnap" />
        <meta
          property="twitter:title"
          content={`webpages (${metaTitle}) - sitesnap.design`}
        />
        <meta
          property="twitter:description"
          content="Seek inspiration for web design at Sitesnap! Explore our curated collection of innovative African websites, fueling creativity for designers & developers."
        />
        <meta property="twitter:image" content={ogImage} />
      </Head>

      <HeadingOne text={specificPages?.[0]?.page_name} />

      <Modal
        className="h-full max-w-[1199px] bg-white"
        transitionParentClassName="p-4"
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          router.push(`/webpages/${router.query.id}`, undefined, {
            shallow: true,
            scroll: false,
          });
        }}
        onKeyDown={handleKeyDown}
      >
        <div className="flex flex-wrap items-center justify-center gap-3 p-4 sm:flex-nowrap sm:justify-between sm:gap-0 sm:py-8 sm:px-12">
          <p className="font-medium text-body">
            {specificPages?.[0]?.page_name}
          </p>
          <Link
            href={`/companies/${activePage?.company_name
              .replace(/ /g, '-')
              .toLowerCase()
              .replace(/-+$/, '')}`}
          >
            <a className="font-medium text-body hover:text-blue">
              {activePage?.company_name ?? '-'}
            </a>
          </Link>
          <div className="flex items-center gap-6">
            <button onClick={getPrevCompany} className="h-6 w-6">
              <Image alt="prev" src={prevIc} width={24} height={24} />
            </button>
            <button onClick={getNextCompany} className="h-6 w-6">
              <Image alt="next" src={nextIc} width={24} height={24} />
            </button>
            <div className="h-4 w-[1px] bg-[#D6D1CA]" />
            <button
              onClick={() => {
                setIsOpen(false);
                router.push(`/webpages/${router.query.id}`, undefined, {
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
              objectFit="cover"
              objectPosition="top"
              tabIndex={0}
            />
          ) : null}
        </div>
      </Modal>

      <section>
        <div className="card lg:px-3">
          {data?.data
            ?.slice(offset, offset + PER_PAGE)
            ?.map((page: Page, index: number) => (
              <article
                key={index}
                className="flex flex-col gap-4 py-0 md:gap-5 lg:py-14"
              >
                <h2 className="text-md-small font-medium text-grey md:text-md">
                  {page.company_name}
                </h2>
                <Card
                  src={page.thumbnail_url}
                  alt={page.company_name}
                  image_data={page.thumbnail_url}
                  onClick={() => openModal(page)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      openModal(page);
                    }
                  }}
                />
              </article>
            ))}
        </div>
      </section>
      <Pagination
        pageCount={pageCount}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        currentPageData={currentPageData}
      />
    </>
  );
};

export default IndividualWebpages;

export const getStaticPaths: GetStaticPaths = async () => {
  const webpagesData = await getWebpages();

  const pagesArray = webpagesData?.data?.map(
    (page: Page) => page.attributes.pages,
  );

  const flattenedPages = pagesArray?.flat();

  const webpages = flattenedPages?.filter((page: Page, index: number) => {
    return (
      flattenedPages?.findIndex((p: Page) => p.page_name === page.page_name) ===
      index
    );
  });

  const paths = webpages?.map((page: Page) => ({
    params: {id: slugify(page.page_name)},
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({params}) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(['webpages', params?.id], getWebpages);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
