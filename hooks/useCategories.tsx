import {useQuery} from '@tanstack/react-query';
import axios from 'axios';

export function useCategories() {
  return useQuery(['categories'], () =>
    axios
      .get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/companies?fields=industry`)
      .then(res => res.data),
  );
}
