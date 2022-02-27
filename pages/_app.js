import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import { RecoilRoot } from 'recoil';
import Loader from '../components/Loader';
import '../styles/globals.scss';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Q Press</title>
        <meta
          name="description"
          content="WordPress Clone with React Next.JS, MongoDB..."
        />
        <link rel="icon" href="/img/favicon.png" />
      </Head>
      <RecoilRoot>
        <Loader>
          <Component {...pageProps} />
        </Loader>
      </RecoilRoot>
    </SessionProvider>
  );
}

export default MyApp;
