import Image from 'next/image';
import styles from '../styles/Avatar.module.scss';

const Avatar = ({ user }) => {
  return (
    <div className={styles.avatar}>
      {user.image ? (
        <Image src={user.image} alt={user.name} width="40" height="40" />
      ) : (
        <span className={styles.imagePlacehold}>{user.name.charAt(0)}</span>
      )}
    </div>
  );
};

export default Avatar;
