import { useEffect, useState } from 'react';
import { faCloudUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card } from 'react-bootstrap';
import styles from '../styles/Media.module.scss';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { errorState } from '../atoms/errorAtom';
import { handleMediaState, useSSRMediasState } from '../atoms/mediaState';
import MediaSingle from './Media';

const Media = ({ medias, imagePickerHandler }) => {
  const [realtimeMedias, setRealtimeMedias] = useState({});
  const [handleMedia, setHandleMedia] = useRecoilState(handleMediaState);
  const [useSSRMedias, setUseSSRMedias] = useRecoilState(useSSRMediasState);
  const [error, setError] = useRecoilState(errorState);

  useEffect(() => {
    const fetchMedias = async () => {
      const response = await axios.get(`/api/media`).then((r) => r.data);
      setRealtimeMedias(response);
      setHandleMedia(false);
      setUseSSRMedias(false);
    };
    fetchMedias();
  }, [handleMedia]);

  const fileSelectedHandler = (event) => {
    if (
      (!useSSRMedias && realtimeMedias.count < 50) ||
      (useSSRMedias && medias.count < 50)
    ) {
      Array.from(event.target.files).map(async (file, i) => {
        setError({ state: 'info', message: 'Be patient, media is uploading' });
        let timeId = new Date().valueOf() + '_' + i;
        const formData = new FormData();
        formData.append(timeId, file);
        const { data: media } = await axios
          .post('/api/media', formData)
          .then((r) => r.data);
        if (media?.state !== 'error') {
          setHandleMedia(true);
        } else {
          setError(media);
        }
        return setError({
          state: 'success',
          message: 'Uploading media successful',
        });
      });
    } else {
      setError({ state: 'error', message: 'Sorry, upload limit exceeded' });
    }
  };

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
        {!useSSRMedias ? (
          <>
            {realtimeMedias.count > 0 ? (
              <>
                {realtimeMedias.medias.map((file) => (
                  <MediaSingle
                    key={file._id}
                    file={file}
                    imagePickerHandler={imagePickerHandler}
                  />
                ))}
              </>
            ) : null}
          </>
        ) : (
          <>
            {medias.count > 0 ? (
              <>
                {medias.medias.map((file) => (
                  <MediaSingle
                    key={file._id}
                    file={file}
                    imagePickerHandler={imagePickerHandler}
                  />
                ))}
              </>
            ) : null}
          </>
        )}
      </div>
    </Card>
  );
};

export default Media;
