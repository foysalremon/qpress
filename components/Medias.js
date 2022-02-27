import { faCloudUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card } from 'react-bootstrap';
import styles from '../styles/Media.module.scss';

const Media = () => {
  const fileSelectedHandler = (event) => {};

  return (
    <Card>
      <label className={styles.uploader}>
        <input
          accept="image/*"
          className={styles.input}
          multiple
          type="file"
          onChange={fileSelectedHandler}
        />
        <Button className={styles.uploadBtn}>
          <FontAwesomeIcon icon={faCloudUpload} />
          Upload
        </Button>
      </label>
    </Card>
  );
};

export default Media;
