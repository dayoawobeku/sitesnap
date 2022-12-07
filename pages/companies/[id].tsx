import {useState} from 'react';
import type {GetServerSideProps, NextPage} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import Image, {StaticImageData} from 'next/image';
import {closeIc, hyperlink, nextIc, prevIc} from '../../assets/images/images';
import {slugify} from '../../helpers';
import {dehydrate, QueryClient, useQuery} from '@tanstack/react-query';
import {getCompany} from '../../queryfns';
import {Card, Modal} from '../../components';
import axios from 'axios';

interface Company {
  attributes: {
    slug: string;
  };
}

interface Page {
  page_name: string;
  page_url: string;
  image_url: StaticImageData;
  company_name: string;
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
  const {data: company} = useQuery(['company', router.query.id], () =>
    getCompany(router.query.id),
  );
  const pagesArray =
    company?.data[0]?.attributes?.pages ||
    previewData?.data[0]?.attributes?.pages;

  // get the page that is currently active
  const activePage = pagesArray?.find(
    (page: Page) => slugify(page.page_name) === router.query.page,
  );

  // get the index of the active page
  const activePageIndex = pagesArray?.findIndex(
    (page: Page) => page.page_name === activePage?.page_name,
  );

  // get the next page
  function getNextPage() {
    if (activePageIndex === pagesArray?.length - 1) {
      const firstPage = pagesArray?.find(
        (page: Page, index: number) => index === 0,
      );
      const firstPageName = slugify(firstPage?.page_name);

      router.push(
        `/companies/${router.query.id}?page=${firstPageName}`,
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
        `/companies/${router.query.id}?page=${nextPageName}`,
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
        `/companies/${router.query.id}?page=${lastPageName}`,
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
        `/companies/${router.query.id}?page=${prevPageName}`,
        undefined,
        {
          shallow: true,
          scroll: false,
        },
      );
      return prevPage;
    }
  }

  return (
    <>
      <Head>
        <title>Company</title>
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
          className="flex items-center gap-2 rounded-lg bg-white-200 p-4 font-medium outline outline-1 outline-body transition-all hover:bg-white"
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
      >
        <div className="flex items-center justify-between px-12 py-8">
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
        <div className="full-width-img relative h-full w-full">
          {activePage ? (
            <Image
              alt={activePage?.page_name}
              src={activePage?.image_url}
              layout="fill"
              objectFit="contain"
            />
          ) : null}
        </div>
      </Modal>

      <section className="card">
        {pagesArray?.map((page: Page, index: number) => (
          <article key={index} className="flex flex-col gap-5 py-0 lg:py-14">
            <h2 className="text-md font-medium text-grey">{page?.page_name}</h2>
            <Card
              src={page?.image_url}
              alt={page?.company_name + ' ' + page?.page_name}
              image_data={page?.image_url}
              onClick={() => {
                setIsOpen(true);
                router.push(
                  `/companies/${router.query.id}?page=${slugify(
                    page.page_name,
                  )}`,
                  undefined,
                  {
                    shallow: true,
                    scroll: false,
                  },
                );
              }}
            />
          </article>
        ))}
      </section>
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
