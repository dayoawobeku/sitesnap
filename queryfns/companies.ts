import axios from 'axios';

interface Slug {
  slug: string | string[] | undefined;
}

function getCompanies() {
  return axios
    .get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/companies?sort=createdAt:DESC`,
    )
    .then(res => res.data);
}

function getCompaniesByIndustry() {
  return axios
    .get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/companies?sort=createdAt:DESC&fields[0]=industry&fields[1]=pages`,
    )
    .then(res => res.data);
}

function getPaginatedCompanies(pageIndex = 1) {
  return axios
    .get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/companies?pagination[page]=${pageIndex}&pagination[pageSize]=60&sort=createdAt:DESC&fields[0]=name&fields[1]=description&fields[2]=publishedAt&fields[3]=slug&fields[4]=pages`,
    )
    .then(res => res.data);
}

function getCompany(slug: Slug['slug']) {
  return axios
    .get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/companies?filters[slug][$eq]=${slug}&sort=createdAt:DESC`,
    )
    .then(res => res.data);
}

export {
  getCompanies,
  getPaginatedCompanies,
  getCompany,
  getCompaniesByIndustry,
};
