import { useSession } from 'next-auth/react';
import { Toast } from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import { errorState } from '../atoms/errorAtom';
import styles from '../styles/Loader.module.scss';

const Loader = ({ children }) => {
  const { status } = useSession();
  const [error, setError] = useRecoilState(errorState);

  return (
    <>
      <div
        className={`${styles.loader} ${
          status === 'loading' ? '' : styles.hide
        }`}
      >
        <div className={styles.loading}>
          <h1>QPRESS</h1>
          <h5>LOADING</h5>
        </div>
      </div>
      <Toast
        onClose={() => setError({ ...error, message: '' })}
        show={Boolean(error.message)}
        delay={5000}
        autohide
        className={`${styles.snackBar} ${
          error.state === 'error' ? styles.error : ''
        }${error.state == 'info' ? styles.info : ''}`}
      >
        <Toast.Body>{error.message}</Toast.Body>
      </Toast>
      {children}
    </>
  );
};

export default Loader;
