import axios from 'axios';

interface Slug {
  slug: string | string[] | undefined;
}

export function getIndustry(slug: Slug['slug']) {
  return axios
    .get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/companies?filters[industry][$eqi]=${slug}&sort=createdAt:DESC`,
    )
    .then(res => res.data);
}
