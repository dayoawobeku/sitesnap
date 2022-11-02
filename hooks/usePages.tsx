import {useQuery} from '@tanstack/react-query';
import axios from 'axios';

export function usePages() {
  return useQuery(['pages'], () =>
    axios
      .get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/companies?fields=pages`)
      .then(res => res.data),
  );
}
