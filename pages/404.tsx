import Head from 'next/head';

export default function ErrorPage() {
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

      <div className="my-10">
        <h1 className="text-xl font-medium text-blue">404 - Page Not Found</h1>
      </div>
    </>
  );
}
