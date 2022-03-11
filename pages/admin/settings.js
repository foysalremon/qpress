import { faClose, faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import moment from 'moment';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import { errorState } from '../../atoms/errorAtom';
import Admin from '../../components/Admin';
import Input from '../../components/Input';
import Medias from '../../components/Medias';
import styles from '../../styles/Settings.module.scss';

const Settings = ({ settings, medias, users }) => {
  const [formData, setFormData] = useState(settings);
  const [userOptions, setUserOptions] = useState(
    users.users.map((user) => {
      let option = { value: user._id };
      if (user.name) {
        option.label = user.name;
      } else {
        option.label = user.email;
      }
      return option;
    })
  );
  const [imagePicker, setImagePicker] = useState(false);
  const [error, setError] = useRecoilState(errorState);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const imagePickerHandler = (e) => {
    setFormData({ ...formData, logo: e.target.dataset.id });
    setImagePicker(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError({ state: 'info', message: 'Be patient, settings are updating' });
      const { data } = await axios.patch(`/api/settings`, formData);
      if (data?.state === 'error') {
        setError(data);
      } else {
        setError({
          state: 'success',
          message: 'Settings updated successfully',
        });
      }
    } catch (error) {
      setError({ state: 'error', message: error.message });
    }
  };

  return (
    <>
      <Head>
        <title>Settings - Q Press</title>
      </Head>
      <Admin active="Settings" title="Settings">
        <Card>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.mediaInputWrap}>
              <button
                type="button"
                onClick={() => setImagePicker((prev) => !prev)}
              >
                {formData.logo ? (
                  <img
                    src={
                      medias.medias.find((media) => media._id === formData.logo)
                        ?.url
                    }
                    alt={formData.siteTitle}
                  />
                ) : (
                  <FontAwesomeIcon icon={faImage} />
                )}
              </button>
              <span className={styles.placeholder}>Logo</span>
            </label>
            <Input
              type="text"
              name="siteTitle"
              placeholder="Site Title"
              value={formData?.siteTitle}
              onChange={handleChange}
            />
            <Input
              type="text"
              name="siteTagline"
              placeholder="Site Tagline"
              value={formData?.siteTagline}
              onChange={handleChange}
            />
            <Input
              type="select"
              name="featuredAuthor"
              placeholder="Featured Author"
              value={formData?.featuredAuthor ? formData?.featuredAuthor : ''}
              onChange={handleChange}
              options={userOptions}
            />
            <Row>
              <Col md={6}>
                <Input
                  type="radio"
                  name="dateFormat"
                  placeholder="Date Format"
                  value={formData?.dateFormat}
                  onChange={handleChange}
                  options={[
                    'MMMM D YYYY',
                    'YYYY-MM-DD',
                    'MM/DD/YYYY',
                    'DD/MM/YYYY',
                  ].map((format) => {
                    return {
                      value: format,
                      label: moment().format(format),
                    };
                  })}
                />
              </Col>
              <Col md={6}>
                <Input
                  className="timeFormat"
                  type="radio"
                  name="timeFormat"
                  placeholder="Time Format"
                  value={formData?.timeFormat}
                  onChange={handleChange}
                  options={['h:mm a', 'h:mm A', 'H:mm'].map((format) => {
                    return {
                      value: format,
                      label: moment().format(format),
                    };
                  })}
                />
              </Col>
              <Col md={6}>
                <Input
                  type="number"
                  name="postPerPage"
                  placeholder="Post Per Page"
                  value={formData?.postPerPage}
                  onChange={handleChange}
                />
              </Col>
              <Col md={6}>
                <Input
                  type="text"
                  name="copyright"
                  placeholder="Copyright"
                  value={formData?.copyright}
                  onChange={handleChange}
                />
              </Col>
            </Row>
            <button type="submit" className="btn">
              Update Settings
            </button>
            <div className={`imageInserter ${imagePicker ? 'open' : ''}`}>
              <Medias medias={medias} imagePickerHandler={imagePickerHandler} />
              <div className="image-inserter-header">
                <h6>Add Media</h6>
                <button
                  className="imageInserterClose"
                  onClick={() => setImagePicker(false)}
                >
                  <FontAwesomeIcon icon={faClose} />
                </button>
              </div>
            </div>
          </form>
        </Card>
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

  const settings = await axios
    .get(`${process.env.NEXTAUTH_URL}/api/settings`)
    .then((r) => r.data);

  const medias = await axios
    .get(`${process.env.NEXTAUTH_URL}/api/media`)
    .then((r) => r.data);

  const users = await axios
    .get(`${process.env.NEXTAUTH_URL}/api/users`)
    .then((r) => r.data);

  return {
    props: {
      session,
      settings,
      medias,
      users,
    },
  };
}

export default Settings;
