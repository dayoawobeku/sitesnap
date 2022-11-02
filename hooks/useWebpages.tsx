import {useQuery} from '@tanstack/react-query';
import axios from 'axios';

export function useWebpages() {
  return useQuery(['pages'], () =>
    axios
      .get(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/companies?fields=pages&sort=createdAt:DESC`,
      )
      .then(res => res.data),
  );
}
