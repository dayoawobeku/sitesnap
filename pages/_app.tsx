import {useState} from 'react';
import type {AppProps} from 'next/app';
import {
  QueryClientProvider,
  QueryClient,
  Hydrate,
  DehydratedState,
} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import Layout from '../components/Layout';
import '../styles/globals.css';

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
  console.log(pageProps, 'pageProps');
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <ReactQueryDevtools initialIsOpen />
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
