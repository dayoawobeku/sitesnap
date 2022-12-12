import type {GetStaticProps, NextPage} from 'next';
import Head from 'next/head';
import {dehydrate, QueryClient, useQuery} from '@tanstack/react-query';
import {getCompanies} from '../../queryfns';
import {CompanyCard, HeadingOne} from '../../components';
import {ogImage, url} from '../../helpers';

const Companies: NextPage = () => {
  const {data: companies} = useQuery(['companies'], getCompanies);

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
      </section>
    </>
  );
};

export default Companies;

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['companies'], getCompanies);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
