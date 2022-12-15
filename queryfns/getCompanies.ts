import axios from 'axios';

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
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/companies?pagination[page]=${pageIndex}&pagination[pageSize]=8&sort=createdAt:DESC`,
    )
    .then(res => res.data);
}

export {getCompanies, getPaginatedCompanies};
