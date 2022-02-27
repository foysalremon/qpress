import { getSession } from 'next-auth/react';
import Head from 'next/head';
import Admin from '../../components/Admin';
import Medias from '../../components/Medias';

const Media = () => {
  return (
    <>
      <Head>
        <title>Media - Q Press</title>
      </Head>
      <Admin active="Media" title="Media">
        <Medias />
      </Admin>
    </>
  );
};

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: `/admin/signin`,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}

export default Media;
