import {useQuery} from '@tanstack/react-query';
import axios from 'axios';

export function useCompanies() {
  return useQuery(['companies'], () =>
    axios
      .get(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/companies?sort=createdAt:DESC`,
      )
      .then(res => res.data),
  );
}
