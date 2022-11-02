import {useQuery} from '@tanstack/react-query';
import axios from 'axios';

interface Slug {
  slug: string | string[] | undefined;
}

export function useCompany(slug: Slug['slug']) {
  return useQuery(
    [`company-${slug}`],
    () =>
      axios
        .get(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/companies?filters[slug][$eq]=${slug}`,
        )
        .then(res => res.data),
    {
      enabled: !!slug,
    },
  );
}
