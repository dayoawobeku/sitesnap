import axios from 'axios';

export function getWebpages() {
  return axios
    .get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/companies?fields=pages&sort=createdAt:DESC`,
    )
    .then(res => res.data);
}
