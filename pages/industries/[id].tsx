import type {NextPage} from 'next';
import Head from 'next/head';
import {StaticImageData} from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {dehydrate, QueryClient, useQuery} from '@tanstack/react-query';
import {getCompanies, getIndustry} from '../../queryfns';
import {Card, HeadingOne, Pagination} from '../../components';
import {ogImage, url} from '../../utils/constants';
import {slugify, unslugify} from '../../utils/helpers';
import {useState} from 'react';

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
  const unSlugifiedIndustryName = unslugify(router.query.id as string);

  const {data: industries} = useQuery({
    queryKey: ['industry', unSlugifiedIndustryName],
    queryFn: () => getIndustry(unSlugifiedIndustryName),
  });

  const industryName = industries?.data?.[0]?.attributes?.industry;

  const industryCompanies = industries?.data?.filter(
    (company: Company) =>
      company.attributes.industry.toLowerCase() === industryName.toLowerCase(),
  );

  const companiesList = industryCompanies?.map(
    (company: Company) => company.attributes,
  );

  const metaTitle = industryName.toLowerCase();

  const [currentPage, setCurrentPage] = useState(0);
  const data = {
    data: companiesList,
    meta: {
      pagination: {
        page: currentPage + 1,
        pageCount: Math.ceil(companiesList?.length / 60),
        pageSize: 60,
        total: companiesList?.length,
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
        <title>{`industries (${metaTitle}) - sitesnap.design`}</title>
        <meta
          name="title"
          property="og:title"
          content={`industries (${metaTitle}) - sitesnap.design`}
        />
        <meta
          name="description"
          content="Seek inspiration for web design at Sitesnap! Explore our curated collection of innovative African websites, fueling creativity for designers & developers."
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
          content="Seek inspiration for web design at Sitesnap! Explore our curated collection of innovative African websites, fueling creativity for designers & developers."
        />
        <meta property="og:site_name" content="sitesnap.design" />
        <meta name="image" property="og:image" content={ogImage} />
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content={`${url}/industries/${router.query.id}`}
        />
        <meta property="twitter:site" content="@sitesnap" />
        <meta
          property="twitter:title"
          content={`industries (${metaTitle}) - sitesnap.design`}
        />
        <meta
          property="twitter:description"
          content="Seek inspiration for web design at Sitesnap! Explore our curated collection of innovative African websites, fueling creativity for designers & developers."
        />
        <meta property="twitter:image" content={ogImage} />
      </Head>

      <HeadingOne text={industryName ?? '-'} />

      <section>
        <div className="card lg:px-3">
          {data?.data
            ?.slice(offset, offset + PER_PAGE)
            ?.map((company: Company, index: number) => (
              <Link key={index} href={`/companies/${slugify(company.name)}`}>
                <a className="flex flex-col gap-4 py-0 md:gap-5 lg:py-14">
                  <h2 className="text-md-small font-medium text-grey md:text-md">
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
      <Pagination
        pageCount={pageCount}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        currentPageData={currentPageData}
      />
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
  const unSlugifiedIndustryName = unslugify(params.id as string);

  await queryClient.prefetchQuery(['industry', unSlugifiedIndustryName], () =>
    getIndustry(unSlugifiedIndustryName),
  );
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
