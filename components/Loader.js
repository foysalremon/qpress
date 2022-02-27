import { useSession } from 'next-auth/react';
import styles from '../styles/Loader.module.scss';

const Loader = ({ children }) => {
  const { status } = useSession();

  return (
    <>
      {/* {status === 'loading' && ( */}
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
      {/* )} */}
      {children}
    </>
  );
};

export default Loader;
