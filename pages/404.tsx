import type {NextPage} from 'next';
import Head from 'next/head';

const ErrorPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>404 - sitesnap.design</title>
        <meta
          name="title"
          property="og:title"
          content="404 - sitesnap.design"
        />
        <meta name="description" content="Page not found." />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <>
        <Head>
          <title>404 - Page not found</title>
        </Head>

        <h1 className="text-blue">404 - Page Not Found</h1>
      </>
    </>
  );
};

export default ErrorPage;
