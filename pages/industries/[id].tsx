import type {NextPage} from 'next';
import Head from 'next/head';
import {StaticImageData} from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {dehydrate, QueryClient, useQuery} from '@tanstack/react-query';
import {getCompanies, getIndustry} from '../../queryfns';
import {Card, HeadingOne} from '../../components';
import {ogImage, url} from '../../utils/constants';
import {slugify} from '../../utils/helpers';

interface Company {
  id: string;
  name: string;
  pages: {
    thumbnail_url: StaticImageData;
  }[];
  attributes: {
    industry: string;
    name: string;
    slug: string;
  };
}

const IndividualIndustries: NextPage = () => {
  const router = useRouter();

  const {data: industries} = useQuery(['industry', router.query.id], () =>
    getIndustry(router.query.id),
  );

  const industryName = industries?.data?.[0]?.attributes?.industry;

  const industryCompanies = industries?.data?.filter(
    (company: Company) =>
      company.attributes.industry.toLowerCase() === industryName.toLowerCase(),
  );

  const companiesList = industryCompanies?.map(
    (company: Company) => company.attributes,
  );

  const metaTitle = industryName.toLowerCase();

  return (
    <>
      <Head>
        <title>{`industries (${metaTitle}) - sitesnap.design`}</title>
        <meta
          name="title"
          property="og:title"
          content={`industries (${metaTitle}) - sitesnap.design`}
        />
        <meta
          name="description"
          content="Find your favorite sites in one place, then learn from the greats."
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="canonical"
          href={`${url}/industries/${router.query.id}`}
          key="canonical"
        />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`${url}/industries/${router.query.id}`}
        />
        <meta
          property="og:title"
          content={`industries (${metaTitle}) - sitesnap.design`}
        />
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
          content={`${url}/industries/${router.query.id}`}
        />
        {/* <meta property="twitter:site" content="@sitesnap_design" /> */}
        <meta
          property="twitter:title"
          content={`industries (${metaTitle}) - sitesnap.design`}
        />
        <meta
          property="twitter:description"
          content="Find your favorite sites in one place, then learn from the greats."
        />
        <meta property="twitter:image" content={ogImage} />
      </Head>

      <HeadingOne text={industryName ?? '-'} />

      <section>
        <div className="card lg:px-3">
          {companiesList?.map((company: Company, index: number) => (
            <Link key={index} href={`/companies/${slugify(company.name)}`}>
              <a className="flex flex-col gap-5 py-0 lg:py-14">
                <h2 className="text-md font-medium text-grey">
                  {company.name}
                </h2>
                <Card
                  src={company?.pages[0]?.thumbnail_url}
                  alt=""
                  image_data={company?.pages[0]?.thumbnail_url}
                />
              </a>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default IndividualIndustries;

export async function getStaticPaths() {
  const {data: companies} = await getCompanies();

  const uniqueIndustries = companies?.filter(
    (company: Company, index: number, self: Company[]) => {
      return (
        index ===
        self.findIndex(
          t => t?.attributes?.industry === company?.attributes?.industry,
        )
      );
    },
  );

  const paths = uniqueIndustries?.map((company: Company) => ({
    params: {id: slugify(company?.attributes?.industry)},
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({params}: {params: {id: string}}) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['industry', params.id], () =>
    getIndustry(params.id),
  );
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
