import { getSession } from 'next-auth/react';
import axios from 'axios';
import Head from 'next/head';
import Admin from '../../components/Admin';
import Medias from '../../components/Medias';

const Media = ({ medias }) => {
  return (
    <>
      <Head>
        <title>Media - Q Press</title>
      </Head>
      <Admin active="Media" title="Media">
        <Medias medias={medias} />
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

  const medias = await axios
    .get(`${process.env.NEXTAUTH_URL}/api/media`)
    .then((r) => r.data);

  return {
    props: {
      session,
      medias,
    },
  };
}

export default Media;
