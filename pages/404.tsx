import type {NextPage} from 'next';
import Head from 'next/head';

const ErrorPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>404 - Page not found</title>
      </Head>

      <h1 className="text-blue">404 - Page Not Found</h1>
    </>
  );
};

export default ErrorPage;
