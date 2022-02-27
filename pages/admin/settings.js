import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { Button, Card } from 'react-bootstrap';
import Admin from '../../components/Admin';

const Settings = () => {
  return (
    <>
      <Head>
        <title>Settings - Q Press</title>
      </Head>
      <Admin active="Settings" title="Settings">
        <Card>
          <Card.Img variant="top" src="holder.js/100px180" />
          <Card.Body>
            <Card.Title>Card Title</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the
              bulk of the cards content.
            </Card.Text>
            <Button variant="primary">Go somewhere</Button>
          </Card.Body>
        </Card>
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

export default Settings;
