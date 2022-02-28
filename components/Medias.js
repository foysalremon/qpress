import { useState } from 'react';
import {
  faCloudUpload,
  faEdit,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card } from 'react-bootstrap';
import styles from '../styles/Media.module.scss';
import axios from 'axios';
import Image from 'next/image';

const Media = ({ medias, imagePickerHandler }) => {
  const [uploadingImg, setUploadingImg] = useState([]);
  const [count, setCount] = useState(0);

  const fileSelectedHandler = (event) => {
    if (count < 50) {
      Array.from(event.target.files).map(async (file, i) => {
        let timeId = new Date().valueOf() + '_' + i;
        const formData = new FormData();
        let oldUploading = uploadingImg;
        oldUploading.push({ name: file.name, state: 'uploading', timeId });
        setUploadingImg(oldUploading);
        formData.append(timeId, file);
        const media = await axios
          .post('/api/media', formData)
          .then((r) => r.data);
        if (media?.status !== 'error') {
          setUploadingImg(
            uploadingImg.map((img) =>
              img.timeId === media.timeId ? media : img
            )
          );
        }
        return false;
      });
    } else {
    }
  };

  const deleteHandler = () => {};

  return (
    <Card>
      <label className={styles.uploader}>
        <input
          accept="image/*"
          className={styles.input}
          type="file"
          onChange={fileSelectedHandler}
        />
        <Button className={styles.uploadBtn}>
          <FontAwesomeIcon icon={faCloudUpload} />
          Upload
        </Button>
      </label>
      <div className={styles.imageList}>
        {uploadingImg.length > 0 ? (
          <>
            {uploadingImg.map((file, index) => (
              <div className={styles.imageWrap} key={index}>
                <div className={styles.image}>
                  {file?.state === 'uploading' ? (
                    <div className={styles.circularProgress}></div>
                  ) : (
                    <>
                      <Image
                        src={file.thumb}
                        alt={file.alt}
                        className={styles.imageMedia}
                        data-id={file._id}
                        width={180}
                        height={180}
                        onClick={imagePickerHandler}
                      />
                      <div className={actionIcons}>
                        <a
                          className={styles.actionEdit}
                          href={`/admin/media/${file._id}`}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </a>
                        <button
                          className={styles.actionDelete}
                          onClick={() => deleteHandler(file._id)}
                        >
                          <FontAwesomeIcon icon={faDeleteLeft} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </>
        ) : null}
        {medias.length > 0 ? (
          <>
            {medias.map((file, index) => (
              <div className={styles.imageWrap} key={index}>
                <div className={styles.image}>
                  <>
                    <Image
                      src={file.thumb}
                      alt={file.alt}
                      className={styles.imageMedia}
                      data-id={file._id}
                      width={180}
                      height={180}
                      onClick={imagePickerHandler}
                    />
                    <div className={styles.actionIcons}>
                      <a
                        className={styles.actionBtn}
                        href={`/admin/media/${file._id}`}
                      >
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
            ))}
          </>
        ) : null}
      </div>
    </Card>
  );
};

export default Media;
