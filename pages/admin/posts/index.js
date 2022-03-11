import { faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { Card, Table } from 'react-bootstrap';
import Admin from '../../../components/Admin';
import Avatar from '../../../components/Avatar';

const Posts = ({ posts }) => {
  return (
    <>
      <Head>
        <title>Posts - Q Press</title>
      </Head>
      <Admin active="Posts" subactive="All Posts" title="Posts">
        <Card className="tableWrap">
          {console.log(posts)}
          {posts.count < 1 ? (
            <>
              <p>There is no post yet</p>
              <Link href="/posts/edit-post">
                <a className="btn">Create First Post</a>
              </Link>
            </>
          ) : (
            <Table striped borderless hover responsive>
              <thead>
                <tr>
                  <th></th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Categories</th>
                  <th>Tags</th>
                  <th>
                    <FontAwesomeIcon icon={faComment} />
                  </th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {posts.posts?.map((post) => (
                  <tr key={post._id}>
                    <td></td>
                    <td>{post.title}</td>
                    <td>{post.author?.name}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
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

  const page = ctx.query.page ? ctx.query.page : 1;

  const posts = await axios
    .get(`${process.env.NEXTAUTH_URL}/api/posts?page=${page}`)
    .then((r) => r.data);

  return {
    props: {
      session,
      posts,
    },
  };
}

export default Posts;
