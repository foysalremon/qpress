import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { handleMediaState } from '../atoms/mediaState';
import { errorState } from '../atoms/errorAtom';
import styles from '../styles/Media.module.scss';

const MediaSingle = ({ file, imagePickerHandler }) => {
  const [handleMedia, setHandleMedia] = useRecoilState(handleMediaState);
  const [error, setError] = useRecoilState(errorState);

  const deleteHandler = async (id) => {
    setError({ state: 'info', message: 'Be patient, media uploading' });
    const { data } = await axios.delete(`/api/media/${id}`);

    if (data?.state !== 'error') {
      setHandleMedia(true);
      setError({ state: 'success', message: 'Media successfully deleted' });
    } else {
      setError(response);
    }
  };

  return (
    <div className={styles.imageWrap}>
      <div className={styles.image}>
        <>
          <Image
            src={file.thumb}
            alt={file.alt}
            className={styles.imageMedia}
            data-id={file._id}
            data-image={file.url}
            width={180}
            height={180}
            onClick={imagePickerHandler}
          />
          <div className={styles.actionIcons}>
            <a className={styles.actionBtn} href={`/admin/media/${file._id}`}>
              <FontAwesomeIcon icon={faEdit} />
            </a>
            <button
              className={styles.actionBtn}
              onClick={() => deleteHandler(file._id)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </>
      </div>
    </div>
  );
};

export default MediaSingle;
