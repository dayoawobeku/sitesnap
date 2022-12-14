import type {GetStaticProps, NextPage} from 'next';
import Head from 'next/head';
import {dehydrate, QueryClient, useQuery} from '@tanstack/react-query';
import PagesCard from '../../components/PagesCard';
import {getWebpages} from '../../queryfns/getWebpages';
import {HeadingOne} from '../../components';
import {ogImage, url} from '../../helpers';

interface Pages {
  page_name: string;
  attributes: {
    pages: string[];
  };
}

const Webpages: NextPage = () => {
  const {data} = useQuery(['webpages'], getWebpages);

  const pagesArray = data?.data?.map((page: Pages) => page.attributes.pages);
  const flattenedPages = pagesArray?.flat();
  const randomPages = flattenedPages.sort(() => Math.random() - 0.5);

  // sort the random pages alphabetically
  const sortedPages = randomPages.sort((a: Pages, b: Pages) => {
    if (a?.page_name < b?.page_name) {
      return -1;
    }
    if (a?.page_name > b?.page_name) {
      return 1;
    }
    return 0;
  });

  const uniquePages = sortedPages?.filter((page: Pages, index: number) => {
    return (
      randomPages?.findIndex((p: Pages) => p.page_name === page.page_name) ===
      index
    );
  });

  return (
    <>
      <Head>
        <title>webpages - sitesnap.design</title>
        <meta
          name="title"
          property="og:title"
          content="webpages - sitesnap.design"
        />
        <meta
          name="description"
          content="Find your favorite sites in one place, then learn from the greats."
        />
        <link rel="icon" href="/favicon.ico" />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${url}/webpages`} />
        <meta property="og:title" content="webpages - sitesnap.design" />
        <meta
          name="description"
          property="og:description"
          content="Find your favorite sites in one place, then learn from the greats."
        />
        <meta property="og:site_name" content="sitesnap.design" />
        <meta name="image" property="og:image" content={ogImage} />
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`${url}/webpages`} />
        {/* <meta property="twitter:site" content="@sitesnap_design" /> */}
        <meta property="twitter:title" content="webpages - sitesnap.design" />
        <meta
          property="twitter:description"
          content="Find your favorite sites in one place, then learn from the greats."
        />
        <meta property="twitter:image" content={ogImage} />
      </Head>

      <HeadingOne text="Webpages" />

      <section>
        <PagesCard pages={uniquePages} />
      </section>
    </>
  );
};

export default Webpages;

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['webpages'], getWebpages);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
