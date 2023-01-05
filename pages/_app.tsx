import {useEffect, useRef, useState} from 'react';
import dynamic from 'next/dynamic';
import type {AppProps} from 'next/app';
import {Analytics} from '@vercel/analytics/react';
import {
  QueryClientProvider,
  QueryClient,
  Hydrate,
  DehydratedState,
} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import '../styles/globals.css';
import {UserContext} from '../context';
const Layout = dynamic(() => import('../components/Layout'));
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
            staleTime: 1000 * 60 * 60 * 24,
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
        <ReactQueryDevtools />
      </Hydrate>
      <Analytics />
    </QueryClientProvider>
  );
}

export default MyApp;
