import { faClose, faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import { errorState } from '../../../atoms/errorAtom';
import Admin from '../../../components/Admin';
import AuthorBox from '../../../components/AuthorBox';
import Input from '../../../components/Input';
import Medias from '../../../components/Medias';
import styles from '../../../styles/Profile.module.scss';

const Profile = ({ user, medias }) => {
  const [formData, setFormData] = useState(user);
  const [error, setError] = useRecoilState(errorState);
  const [imagePicker, setImagePicker] = useState(false);
  const [imagePickerItem, setImagePickerItem] = useState('avatar');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const imagePickerHandler = (e) => {
    setFormData({ ...formData, [imagePickerItem]: e.target.dataset.id });
    setImagePicker(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError({ state: 'info', message: 'Be patient, profile is updating' });
      const { data } = await axios.patch(`/api/users/${user._id}`, formData);
      if (data?.state === 'error') {
        setError(data);
      } else {
        setError({
          state: 'success',
          message: 'Profile updated successfully',
        });
      }
    } catch (error) {
      setError({ state: 'error', message: error.message });
    }
  };

  return (
    <>
      <Head>
        <title>My Profile - Q Press</title>
      </Head>
      <Admin active="Users" subactive="My Profile" title="My Profile">
        <Row>
          <Col md={8}>
            <Card>
              <form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={formData?.name}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col md={6}>
                    <Input
                      type="readonly"
                      name="email"
                      placeholder="Email Address"
                      value={formData?.email}
                      onChange={handleChange}
                      disabled
                    />
                  </Col>
                  <Col md={6}>
                    <label className={styles.mediaInputWrap}>
                      <button
                        type="button"
                        onClick={() => {
                          setImagePickerItem('avatar');
                          setImagePicker((prev) => !prev);
                        }}
                      >
                        {formData.avatar ? (
                          <img
                            src={
                              medias.medias.find(
                                (media) => media._id === formData.avatar
                              )?.thumb
                            }
                            alt={formData.name}
                          />
                        ) : (
                          <>
                            {formData.image ? (
                              <img src={formData.image} alt={formData.name} />
                            ) : (
                              <FontAwesomeIcon icon={faImage} />
                            )}
                          </>
                        )}
                      </button>
                      <span className={styles.placeholder}>Avatar</span>
                    </label>
                  </Col>
                  <Col md={6}>
                    <label className={styles.mediaInputWrap}>
                      <button
                        type="button"
                        onClick={() => {
                          setImagePickerItem('cover');
                          setImagePicker((prev) => !prev);
                        }}
                      >
                        {formData.cover ? (
                          <img
                            src={
                              medias.medias.find(
                                (media) => media._id === formData.cover
                              )?.post
                            }
                            alt={formData.name}
                          />
                        ) : (
                          <FontAwesomeIcon icon={faImage} />
                        )}
                      </button>
                      <span className={styles.placeholder}>Cover</span>
                    </label>
                  </Col>
                </Row>
                <Input
                  type="text"
                  name="profession"
                  placeholder="Profession"
                  value={formData?.profession}
                  onChange={handleChange}
                />
                <Input
                  type="textarea"
                  name="bio"
                  placeholder="Bio"
                  value={formData?.bio}
                  onChange={handleChange}
                  rows={4}
                />
                <Input
                  type="url"
                  name="facebook"
                  placeholder="Facebook"
                  value={formData?.facebook}
                  onChange={handleChange}
                />
                <Input
                  type="url"
                  name="twitter"
                  placeholder="Twitter"
                  value={formData?.twitter}
                  onChange={handleChange}
                />
                <Input
                  type="url"
                  name="github"
                  placeholder="Github"
                  value={formData?.github}
                  onChange={handleChange}
                />
                <Input
                  type="url"
                  name="linkedin"
                  placeholder="Linkedin"
                  value={formData?.linkedin}
                  onChange={handleChange}
                />
                <button type="submit" className="btn">
                  Update Profile
                </button>
                <div className={`imageInserter ${imagePicker ? 'open' : ''}`}>
                  <Medias
                    medias={medias}
                    imagePickerHandler={imagePickerHandler}
                  />
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
          </Col>
          <Col md={4}>
            <AuthorBox
              user={formData}
              cover={
                medias.medias.find((media) => media._id === formData.cover).post
              }
              avatar={
                formData.avatar
                  ? medias.medias.find((media) => media._id === formData.avatar)
                      .thumb
                  : formData.image
                  ? formData.image
                  : null
              }
            />
          </Col>
        </Row>
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

  const medias = await axios
    .get(`${process.env.NEXTAUTH_URL}/api/media`)
    .then((r) => r.data);

  const users = await axios
    .get(`${process.env.NEXTAUTH_URL}/api/users`)
    .then((r) => r.data);

  const user = await axios
    .get(
      `${process.env.NEXTAUTH_URL}/api/users/${
        users.users.find((item) => item.email === session.user.email)._id
      }`
    )
    .then((r) => r.data);

  return {
    props: {
      session,
      user,
      medias,
    },
  };
}

export default Profile;
