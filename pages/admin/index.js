import { faEdit, faFile, faPhotoFilm } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signIn, signOut, getSession } from 'next-auth/react';
import Head from 'next/head';
import { Col, Row } from 'react-bootstrap';
import Admin from '../../components/Admin';
import styles from '../../styles/Dashboard.module.scss';

const Dashboard = () => {
  return (
    <>
      <Head>
        <title>Dashboard - Q Press</title>
      </Head>
      <Admin active="Dashboard" title="Dashboard">
        <div className={styles.welcomeBanner}>
          <div className={styles.bannerHead}>
            <h1 className={styles.bannerTitle}>Welcome to QPress</h1>
            <h2 className={styles.banneSubtitle}>
              Learn more about QPress on github
            </h2>
          </div>
          <div className={styles.bannerBody}>
            <Row>
              <Col sm={4}>
                <div className={styles.introAvatar}>
                  <FontAwesomeIcon icon={faEdit} />
                </div>
                <div className={styles.boxContent}>
                  <h4 className={styles.introHeading}>Rich text editor</h4>
                  <p className={styles.introDesc}>
                    On post and page editor we have implemented tinymce user
                    friendly customized version. Also sanitizing them on save to
                    show without error
                  </p>
                </div>
              </Col>
              <Col sm={4}>
                <div className={styles.introAvatar}>
                  <FontAwesomeIcon icon={faPhotoFilm} />
                </div>
                <div className={styles.boxContent}>
                  <h4 className={styles.introHeading}>Mediapicker Anywhere</h4>
                  <p className={styles.introDesc}>
                    Any admin page where you needed to pick or insert an image,
                    you can pop it up right where you are and select or upload
                    the appropriate image
                  </p>
                </div>
              </Col>
              <Col sm={4}>
                <div className={styles.introAvatar}>
                  <FontAwesomeIcon icon={faFile} />
                </div>
                <div className={styles.boxContent}>
                  <h4 className={styles.introHeading}>Optimized pagination</h4>
                  <p className={styles.introDesc}>
                    Page and post list with hundreds of entries are paginated by
                    optimized query from api to make it lightweight to use.
                    Paginations maintain from backend
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </div>
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
