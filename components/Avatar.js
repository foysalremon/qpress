import Image from 'next/image';
import styles from '../styles/Avatar.module.scss';

const Avatar = ({ user }) => {
  if (!user) {
    return null;
  }

  return (
    <div className={styles.avatar}>
      {user.image ? (
        <Image
          src={
            user.avatar
              ? user.avatar.thumb
              : user.image
              ? user.image
              : user.name
              ? user.name.charAt(0)
              : user.email.charAt(0)
          }
          alt={user.name ? user.name : user.email}
          width="40"
          height="40"
        />
      ) : (
        <span className={styles.imagePlacehold}>
          <span>{user.name ? user.name.charAt(0) : user.email.charAt(0)}</span>
        </span>
      )}
    </div>
  );
};

export default Avatar;
