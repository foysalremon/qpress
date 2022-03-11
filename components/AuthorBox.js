import {
  faFacebookF,
  faGithub,
  faLinkedinIn,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { Card } from 'react-bootstrap';
import styles from '../styles/AuthorBox.module.scss';

const AuthorBox = ({ user, cover, avatar }) => {
  return (
    <Card className={styles.authorBox}>
      <div
        className={styles.cover}
        style={{ backgroundImage: `url(${cover})` }}
      ></div>
      <div className={styles.content}>
        <div className={styles.thumb}>
          {avatar ? (
            <Image src={avatar} alt={user.name} layout="fill" />
          ) : (
            <span className={styles.imagePlacehold}></span>
          )}
        </div>
        <h5>{user.name ? user.name : user.email}</h5>
        {user.profession && (
          <p className={styles.profession}>{user.profession}</p>
        )}
        {user.bio && <p className={styles.bio}>{user.bio}</p>}
        <div className={styles.socials}>
          {user.facebook && (
            <a href={user.facebook} className={styles.facebook}>
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
          )}
          {user.twitter && (
            <a href={user.twitter} className={styles.twitter}>
              <FontAwesomeIcon icon={faTwitter} />
            </a>
          )}
          {user.github && (
            <a href={user.github} className={styles.github}>
              <FontAwesomeIcon icon={faGithub} />
            </a>
          )}
          {user.linkedin && (
            <a href={user.linkedin} className={styles.linkedin}>
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AuthorBox;
