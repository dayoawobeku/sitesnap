import {GetServerSideProps} from 'next';
import {url} from '../utils/constants';
import {slugify} from '../utils/helpers';

const GET_COMPANIES = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/companies`;
const GET_INDUSTRIES = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/companies?fields[0]=name&fields[1]=industry`;
const GET_WEBPAGES = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/companies?fields=pages`;

interface Companies {
  data: {
    attributes: {
      slug: string;
    };
  }[];
}

interface Industries {
  attributes: {
    industry: string;
    slug: string;
  };
}

interface Webpages {
  page_name: string;
  attributes: {
    pages: {
      page_name: string;
    };
  };
}

function generateSiteMap({
  companies,
  industries,
  webpages,
}: {
  companies: Companies;
  industries: Industries[];
  webpages: Webpages[];
}) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${url}</loc>
     </url>
     <url>
       <loc>${url}/companies</loc>
     </url>
     <url>
       <loc>${url}/industries</loc>
     </url>
     <url>
       <loc>${url}/webpages</loc>
     </url>
     ${companies?.data
       .map(({attributes}) => {
         return `
       <url>
           <loc>${`${url}/companies/${attributes.slug}`}</loc>
       </url>
     `;
       })
       .join('')}
        
        ${industries?.map(({attributes}) => {
          return `
        <url>
            <loc>${`${url}/industries/${attributes.industry.toLowerCase()}`}</loc>
        </url>
     `;
        })}

       ${webpages?.map(page => {
         return `
          <url>
              <loc>${`${url}/webpages/${slugify(page.page_name)}`}</loc>
          </url>
          `;
       })}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({res}) => {
  const companies = await fetch(GET_COMPANIES).then(res => res.json());
  const industriesData = await fetch(GET_INDUSTRIES).then(res => res.json());
  const webpagesData = await fetch(GET_WEBPAGES).then(res => res.json());

  // get only the unique industries
  const industries = industriesData?.data?.reduce(
    (acc: Industries[], curr: Industries) => {
      const x = acc.find(
        item => item.attributes.industry === curr.attributes.industry,
      );
      if (!x) {
        return acc.concat([curr]);
      } else {
        return acc;
      }
    },
    [],
  );

  const pagesArray = webpagesData?.data?.map(
    (page: Webpages) => page.attributes.pages,
  );

  const flattenedPages = pagesArray?.flat();

  const webpages = flattenedPages?.filter((page: Webpages, index: number) => {
    return (
      flattenedPages?.findIndex(
        (p: Webpages) => p.page_name === page.page_name,
      ) === index
    );
  });

  const sitemap = generateSiteMap({
    companies,
    industries,
    webpages,
  });

  res.setHeader('Content-Type', 'text/xml');
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;
