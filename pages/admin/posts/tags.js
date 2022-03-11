import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Card, Col, Row, Button, Table } from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import { handleTagsState, useSSRTagsState } from '../../../atoms/tagState';
import { errorState } from '../../../atoms/errorAtom';
import Admin from '../../../components/Admin';
import Input from '../../../components/Input';

const Tags = ({ tags }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });
  const [error, setError] = useRecoilState(errorState);
  const [realtimeTags, setRealtimeTags] = useState({ count: 0, tags: [] });
  const [handleTags, setHandleTags] = useRecoilState(handleTagsState);
  const [useSSRTags, setUseSSRTags] = useRecoilState(useSSRTagsState);

  useEffect(() => {
    const fetchTags = async () => {
      const response = await axios.get(`/api/tags`).then((r) => r.data);
      setRealtimeTags(response);
      setHandleTags(false);
      setUseSSRTags(false);
    };
    fetchTags();
  }, [handleTags]);

  const handleChange = (e) => {
    if (e.target.name === 'name') {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        slug: e.target.value.replace(/\s+/g, '-').toLowerCase(),
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData._id) {
      setError({ state: 'info', message: 'Be patient. Updating tags' });
      const { data } = axios.patch(`/api/tags/${formData._id}`, formData);
      if (data?.state !== 'error') {
        setError({
          state: 'success',
          message: 'Successfully updated the tags',
        });
        setFormData({ name: '', slug: '', description: '' });
        setHandleTags(true);
      } else {
        setError(data);
      }
    } else {
      setError({ state: 'info', message: 'Be patient. Adding tags' });
      const { data } = axios.post(`/api/tags`, formData);
      if (data?.state !== 'error') {
        setError({
          state: 'success',
          message: 'Successfully added to tags',
        });
        setFormData({ name: '', slug: '', description: '' });
        setHandleTags(true);
      } else {
        setError(data);
      }
    }
  };

  const deleteHandler = (id) => {
    setError({ state: 'info', message: 'Be patient. Deleting tags' });
    const { data } = axios.delete(`/api/tags/${id}`, formData);
    if (data?.state !== 'error') {
      setError({
        state: 'success',
        message: 'Successfully deleted to tags',
      });
      setHandleTags(true);
    } else {
      setError(data);
    }
  };

  return (
    <>
      <Head>
        <title>Tags - Q Press</title>
      </Head>
      <Admin active="Posts" subactive="Tags" title="Tags">
        <Row>
          <Col md={5}>
            <Card className="postSidebar">
              <Card.Header>
                {formData._id ? 'Edit' : 'Add New'} Tags
              </Card.Header>
              <Card.Body>
                <form onSubmit={handleSubmit} autoComplete="off">
                  <Input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData?.name}
                    onChange={handleChange}
                  />
                  <Input
                    type="text"
                    name="slug"
                    placeholder="Slug"
                    value={formData?.slug}
                    onChange={handleChange}
                  />
                  <Input
                    type="textarea"
                    name="description"
                    placeholder="Description"
                    value={formData?.description}
                    onChange={handleChange}
                    rows={4}
                  />
                  <Button variant="primary" type="submit">
                    {formData._id ? 'Edit' : 'Add'} Tags
                  </Button>
                </form>
              </Card.Body>
            </Card>
          </Col>
          <Col md={7}>
            <Card className="tableWrap">
              <Table striped borderless hover responsive>
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Description</th>
                    <th>Post Count</th>
                  </tr>
                </thead>
                <tbody>
                  {!useSSRTags ? (
                    <>
                      {realtimeTags.tags.map((cat) => (
                        <tr key={cat._id}>
                          <td>
                            <div className="actionBtns">
                              <button onClick={() => setFormData(cat)}>
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                              <button
                                className="deleteBtn"
                                onClick={() => deleteHandler(cat._id)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </td>
                          <td>{cat.name}</td>
                          <td>{cat.slug}</td>
                          <td>{cat.description}</td>
                          <td>{cat.posts.count}</td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <>
                      {tags.tags.map((cat) => (
                        <tr key={cat._id}>
                          <td>{cat.name}</td>
                          <td>{cat.slug}</td>
                          <td>{cat.description}</td>
                          <td>{cat.posts.count}</td>
                          <td></td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
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

  const tags = await axios
    .get(`${process.env.NEXTAUTH_URL}/api/tags`)
    .then((r) => r.data);

  return {
    props: {
      session,
      tags,
    },
  };
}

export default Tags;
