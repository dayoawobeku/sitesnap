import axios from 'axios';

export function getCompanies() {
  return axios
    .get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/companies?sort=createdAt:DESC`,
    )
    .then(res => res.data);
}
