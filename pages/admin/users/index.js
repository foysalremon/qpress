import axios from 'axios';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { Card, Table } from 'react-bootstrap';
import Admin from '../../../components/Admin';
import Avatar from '../../../components/Avatar';

const Users = ({ users }) => {
  return (
    <>
      <Head>
        <title>Users - Q Press</title>
      </Head>
      <Admin active="Users" subactive="All Users" title="Users">
        <Card className="tableWrap">
          <Table striped borderless hover responsive>
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>Profession</th>
              </tr>
            </thead>
            <tbody>
              {users.users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <Avatar user={user} />
                  </td>
                  <td>{user.name ? user.name : user.email}</td>
                  <td>{user.email}</td>
                  <td>{user.profession}</td>
                </tr>
              ))}
            </tbody>
          </Table>
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

  const users = await axios
    .get(`${process.env.NEXTAUTH_URL}/api/users/populate`)
    .then((r) => r.data);

  return {
    props: {
      session,
      users,
    },
  };
}

export default Users;
