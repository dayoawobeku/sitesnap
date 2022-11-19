import {useState} from 'react';
import type {NextPage} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import Image from 'next/image';
import {useCompany} from '../../hooks';
import {
  closeIc,
  hyperlink,
  nextIc,
  plainCard,
  prevIc,
} from '../../assets/images/images';
import Modal from '../../components/Modal';

interface Page {
  page_name: string;
  page_url: string;
  image_url: string;
}

const Company: NextPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const {data: company, isLoading: loadingCompany} = useCompany(
    router.query.id,
  );
  const pagesArray = company?.data[0]?.attributes?.pages;

  // get the page that is currently active
  const activePage = pagesArray?.find(
    (page: Page) =>
      page.page_name.toLowerCase().replace(/ /g, '-') === router.query.page,
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
      const firstPageName = firstPage?.page_name
        .toLowerCase()
        .replace(/ /g, '-');
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
      const nextPageName = nextPage?.page_name.toLowerCase().replace(/ /g, '-');
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
      const lastPageName = lastPage?.page_name.toLowerCase().replace(/ /g, '-');
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
      const prevPageName = prevPage?.page_name.toLowerCase().replace(/ /g, '-');
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

      <section className="flex items-center justify-between py-16">
        <h1 className="text-xl font-medium text-grey">
          {company?.data[0]?.attributes?.name}
        </h1>
        <a
          href={company?.data[0]?.attributes?.url}
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
            {company?.data[0]?.attributes?.name}
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
      </Modal>

      <section className="grid grid-cols-2 gap-x-12">
        {loadingCompany
          ? '...'
          : pagesArray?.map((page: Page) => (
              <article
                key={page.image_url}
                className="flex flex-col gap-5 py-14"
              >
                <h2 className="text-md font-medium text-grey">
                  {page?.page_name}
                </h2>
                <div className="relative">
                  {page?.image_url ? (
                    <Image
                      alt=""
                      src={page?.image_url}
                      width={620}
                      height={411}
                      layout="responsive"
                      objectFit="cover"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xg8AAnMBeJQW2OIAAAAASUVORK5CYII="
                      className="cursor-pointer rounded-2xl"
                      onClick={() => {
                        setIsOpen(true);
                        router.push(
                          `/companies/${router.query.id}?page=${page.page_name
                            .toLowerCase()
                            .replace(/ /g, '-')}`,
                          undefined,
                          {
                            shallow: true,
                            scroll: false,
                          },
                        );
                      }}
                    />
                  ) : (
                    <Image
                      alt=""
                      src={plainCard}
                      width={620}
                      height={411}
                      layout="responsive"
                      objectFit="cover"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xg8AAnMBeJQW2OIAAAAASUVORK5CYII="
                      className="rounded-2xl"
                    />
                  )}
                </div>
              </article>
            ))}
      </section>
    </>
  );
};

export default Company;
