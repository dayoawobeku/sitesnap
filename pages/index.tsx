import type {NextPage} from 'next';
import Head from 'next/head';
import Lottie from 'lottie-react';
import lottie from '../assets/construction.json';

const lottieDimension = {
  height: 500,
  width: 500,
};

const Homepage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sitesnap.design</title>
      </Head>

      <div className="m-auto flex min-h-screen flex-col items-center justify-center font-bold text-blue">
        <h1>
          This website is currently in construction, please check back later.
        </h1>

        <Lottie loop={true} animationData={lottie} style={lottieDimension} />
      </div>
    </>
  );
};

export default Homepage;
