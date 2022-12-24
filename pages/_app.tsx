import {useEffect, useRef, useState} from 'react';
import type {AppProps} from 'next/app';
import {Analytics} from '@vercel/analytics/react';
import {
  QueryClientProvider,
  QueryClient,
  Hydrate,
  DehydratedState,
} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import Layout from '../components/Layout';
import '../styles/globals.css';
import {UserContext} from '../context';

interface MyAppProps extends AppProps {
  dehydratedState: DehydratedState;
}

function MyApp({Component, pageProps}: AppProps<MyAppProps>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
  );
  const scrollRef = useRef({
    scrollPos: 0,
  });
  useEffect(() => {
    history.scrollRestoration = 'manual';
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <UserContext.Provider value={{scrollRef}}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </UserContext.Provider>
        <ReactQueryDevtools initialIsOpen />
      </Hydrate>
      <Analytics />
    </QueryClientProvider>
  );
}

export default MyApp;
