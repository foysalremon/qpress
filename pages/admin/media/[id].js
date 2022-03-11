import { getSession } from 'next-auth/react';
import axios from 'axios';
import Head from 'next/head';
import Admin from '../../../components/Admin';
import { Card, Col, Container, Row } from 'react-bootstrap';
import styles from '../../../styles/Media.module.scss';
import Input from '../../../components/Input';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { errorState } from '../../../atoms/errorAtom';

const MediaSingle = ({ media }) => {
  const [formData, setFormData] = useState(media);
  const [error, setError] = useRecoilState(errorState);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError({ state: 'info', message: 'Be patient, media is updating' });
      const { data } = await axios.patch(`/api/media/${media._id}`, formData);
      if (data?.state === 'error') {
        setError(data);
      } else {
        setError({ state: 'success', message: 'Media updated successfully' });
      }
    } catch (error) {
      setError({ state: 'error', message: error.message });
    }
  };

  return (
    <>
      <Head>
        <title>Media - Q Press</title>
      </Head>
      <Admin active="Media" title="Media">
        <Container fluid>
          <Row>
            <Col md={6}>
              <Card className={styles.singImageWrap}>
                <img
                  src={media.url}
                  alt={media.alt}
                  className={styles.imageMedia}
                />
              </Card>
            </Col>
            <Col md={6}>
              <Card className={styles.editImage}>
                <form className={styles.form} onSubmit={handleSubmit}>
                  <Input
                    type="text"
                    name="alt"
                    placeholder="Alt"
                    value={formData?.alt}
                    onChange={handleChange}
                  />
                  <Input
                    type="text"
                    name="caption"
                    placeholder="Caption"
                    value={formData?.caption}
                    onChange={handleChange}
                  />
                  <Input
                    type="readonly"
                    name="url"
                    placeholder="File URL"
                    value={formData?.url}
                    disabled
                  />
                  <button type="submit" className="btn">
                    Update Media
                  </button>
                </form>
              </Card>
            </Col>
          </Row>
        </Container>
      </Admin>
    </>
  );
};

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  const { id } = ctx.params;

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: `/admin/signin`,
      },
    };
  }

  const media = await axios
    .get(`${process.env.NEXTAUTH_URL}/api/media/${id}`)
    .then((r) => r.data);

  return {
    props: {
      session,
      media,
    },
  };
}

export default MediaSingle;
