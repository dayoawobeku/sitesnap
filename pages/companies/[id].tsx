import type {NextPage} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import {useCompany} from '../../hooks';
import {hyperlink, plainCard} from '../../assets/images/images';

interface Page {
  page_name: string;
  page_url: string;
  image_url: string;
}

const Company: NextPage = () => {
  const router = useRouter();
  const {data: company, isLoading: loadingCompany} = useCompany(
    router.query.id,
  );
  console.log(company);

  const pagesArray = company?.data[0]?.attributes?.pages;

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
                      className="rounded-2xl"
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
