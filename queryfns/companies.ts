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

function getPaginatedCompanies(pageIndex = 1) {
  return axios
    .get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/companies?pagination[page]=${pageIndex}&pagination[pageSize]=16&sort=createdAt:DESC`,
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

export {getCompanies, getPaginatedCompanies, getCompany};
