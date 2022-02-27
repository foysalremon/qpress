import { signIn, signOut, getSession } from 'next-auth/react';
import Head from 'next/head';
import Admin from '../../components/Admin';

const Dashboard = () => {
  return (
    <>
      <Head>
        <title>Dashboard - Q Press</title>
      </Head>
      <Admin active="Dashboard" title="Dashboard">
        This is dashboard home
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

export default Dashboard;
