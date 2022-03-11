import axios from 'axios';
import { getSession, useSession } from 'next-auth/react';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import Admin from '../../../../components/Admin';
import Input from '../../../../components/Input';
import { Editor } from '@tinymce/tinymce-react';
import Medias from '../../../../components/Medias';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faImage, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRecoilState } from 'recoil';
import { errorState } from '../../../../atoms/errorAtom';
import { useRouter } from 'next/router';
import {
  handleCategoryState,
  useSSRCategoriesState,
} from '../../../../atoms/categoryState';
import { handleTagsState, useSSRTagsState } from '../../../../atoms/tagState';
import styles from '../../../../styles/PostEdit.module.scss';

const PostEdit = ({ medias, categories, tags }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    status: 'publish',
    categories: [],
    tags: [],
    author: session.user._id,
  });
  const [error, setError] = useRecoilState(errorState);
  const [imagePicker, setImagePicker] = useState(false);
  const [catName, setCatName] = useState('');
  const [realtimeCategories, setRealtimeCategories] = useState({
    count: 0,
    categories: [],
  });
  const [handleCategory, setHandleCategory] =
    useRecoilState(handleCategoryState);
  const [useSSRCategories, setUseSSRCategories] = useRecoilState(
    useSSRCategoriesState
  );
  const [tagName, setTagName] = useState('');
  const [realtimeTags, setRealtimeTags] = useState({ count: 0, tags: [] });
  const [handleTags, setHandleTags] = useRecoilState(handleTagsState);
  const [useSSRTags, setUseSSRTags] = useRecoilState(useSSRTagsState);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get(`/api/categories`).then((r) => r.data);
      setRealtimeCategories(response);
      setHandleCategory(false);
      setUseSSRCategories(false);
    };
    fetchCategories();
  }, [handleCategory]);

  useEffect(() => {
    const fetchTags = async () => {
      const response = await axios.get(`/api/tags`).then((r) => r.data);
      setRealtimeTags(response);
      setHandleTags(false);
      setUseSSRTags(false);
    };
    fetchTags();
  }, [handleTags]);

  const handleCategoryInput = (e) => {
    setCatName(e.target.value);
  };

  const addNewCategory = async () => {
    setError({ state: 'info', message: 'Be patient. Adding category' });
    const { data } = await axios.post(`/api/categories`, { name: catName });
    if (data?.state !== 'error') {
      setError({
        state: 'success',
        message: 'Successfully added to category',
      });
      const newValue = formData.categories;
      newValue.push(data._id);
      setFormData({ ...formData, categories: newValue });
      setCatName('');
      setHandleCategory(true);
    } else {
      setError(data);
    }
  };

  const handleTagInput = (e) => {
    setTagName(e.target.value);
  };

  const addNewTag = async () => {
    setError({ state: 'info', message: 'Be patient. Adding tag' });
    const { data } = await axios.post(`/api/tags`, { name: tagName });
    if (data?.state !== 'error') {
      setError({
        state: 'success',
        message: 'Successfully added to tag',
      });
      const newValue = formData.tags;
      newValue.push(data._id);
      setFormData({ ...formData, tags: newValue });
      setTagName('');
      setHandleTags(true);
    } else {
      setError(data);
    }
  };

  const handleChange = (e) => {
    if (e.target.type === 'checkbox') {
      const newValue = formData[e.target.name];
      if (newValue.includes(e.target.value)) {
        newValue.splice(newValue.indexOf(e.target.value), 1);
      } else {
        newValue.push(e.target.value);
      }
      setFormData({ ...formData, [e.target.name]: newValue });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleTinyChange = (content, editor) => {
    setFormData({ ...formData, content: content });
  };

  const imagePickerHandler = (e) => {
    setFormData({ ...formData, featuredImage: e.target.dataset.id });
    setImagePicker(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ state: 'info', message: 'Be patient. Creating post' });
    const { data } = await axios.post(`/api/posts`, formData);
    if (data?.state !== 'error') {
      setError({
        state: 'success',
        message: 'Post created successfully',
      });
      router.push(`/admin/posts/post-edit/${data._id}`);
    } else {
      setError(data);
    }
  };
  return (
    <>
      <Head>
        <title>Create Post - Q Press</title>
      </Head>
      <Admin active="Posts" subactive="Add Post" title="Add Post">
        <Card>
          <form onSubmit={handleSubmit}>
            <Row>
              <Col md={9}>
                <Input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={formData?.title}
                  onChange={handleChange}
                />
                <Editor
                  id="tiny-react_66837389121646472771269"
                  apiKey={process.env.TINYMCE_KEY}
                  onEditorChange={handleTinyChange}
                  value={formData.content}
                  init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                      'advlist autolink lists link image charmap print preview anchor',
                      'searchreplace visualblocks code fullscreen',
                      'insertdatetime media table paste code help wordcount',
                    ],
                    toolbar:
                      'undo redo | formatselect | ' +
                      'image customImage link bold italic forecolor backcolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | help',
                    content_style:
                      'body { font-family:Lexend Deca,Arial,sans-serif; font-size:14px }',
                    file_picker_types: 'image',
                    file_picker_callback: function (callback, value, meta) {
                      document
                        .querySelector('.imageInserter')
                        .classList.add('open');
                      document
                        .querySelector('.imageInserterClose')
                        .addEventListener('click', function () {
                          document
                            .querySelector('.imageInserter')
                            .classList.remove('open');
                        });
                      document
                        .querySelectorAll('.imageInserter img')
                        .forEach((elem) => {
                          elem.addEventListener('click', function () {
                            callback(this.dataset.image);
                            document
                              .querySelector('.imageInserter')
                              .classList.remove('open');
                          });
                        });
                    },
                  }}
                />
              </Col>
              <Col md={3}>
                <Card className="postSidebar">
                  <Card.Header>Publish</Card.Header>
                  <Card.Body>
                    <Input
                      type="select"
                      name="status"
                      placeholder="Status"
                      value={formData.status ? formData.status : 'publish'}
                      onChange={handleChange}
                      noDefault
                      options={[
                        { label: 'Publish', value: 'publish' },
                        { label: 'Draft', value: 'draft' },
                      ]}
                    />
                    <Button
                      variant="primary"
                      className="btn-block"
                      type="submit"
                    >
                      Save
                    </Button>
                  </Card.Body>
                </Card>
                <Card className="postSidebar">
                  <Card.Header>Categories</Card.Header>
                  <Card.Body>
                    <Input
                      type="checklist"
                      name="categories"
                      placeholder="Categories"
                      value={formData.categories}
                      onChange={handleChange}
                      options={
                        !useSSRCategories
                          ? realtimeCategories.categories.map((cat) => ({
                              label: cat.name,
                              value: cat._id,
                            }))
                          : categories.categories.map((cat) => ({
                              label: cat.name,
                              value: cat._id,
                            }))
                      }
                    />
                    <div className="addNewTaxOnEdit">
                      <Input
                        type="text"
                        name="catName"
                        placeholder="New Category Name"
                        value={catName}
                        onChange={handleCategoryInput}
                      />
                      <Button
                        onClick={addNewCategory}
                        disabled={!Boolean(catName)}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
                <Card className="postSidebar">
                  <Card.Header>Tags</Card.Header>
                  <Card.Body>
                    <Input
                      type="checklist"
                      name="tags"
                      placeholder="Tags"
                      value={formData.tags}
                      onChange={handleChange}
                      options={
                        !useSSRTags
                          ? realtimeTags.tags.map((tag) => ({
                              label: tag.name,
                              value: tag._id,
                            }))
                          : tags.tags.map((tag) => ({
                              label: tag.name,
                              value: tag._id,
                            }))
                      }
                    />
                    <div className="addNewTaxOnEdit">
                      <Input
                        type="text"
                        name="tagName"
                        placeholder="New Tag Name"
                        value={tagName}
                        onChange={handleTagInput}
                      />
                      <Button onClick={addNewTag} disabled={!Boolean(tagName)}>
                        <FontAwesomeIcon icon={faPlus} />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
                <Card className="postSidebar">
                  <Card.Header>Featured Image</Card.Header>
                  <Card.Body>
                    <label className={styles.mediaInputWrap}>
                      <button
                        type="button"
                        onClick={() => setImagePicker((prev) => !prev)}
                      >
                        {formData.featuredImage ? (
                          <img
                            src={
                              medias.medias.find(
                                (media) => media._id === formData.featuredImage
                              )?.post
                            }
                            alt={formData.title}
                          />
                        ) : (
                          <FontAwesomeIcon icon={faImage} />
                        )}
                      </button>
                    </label>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
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

  const medias = await axios
    .get(`${process.env.NEXTAUTH_URL}/api/media`)
    .then((r) => r.data);

  const categories = await axios
    .get(`${process.env.NEXTAUTH_URL}/api/categories`)
    .then((r) => r.data);

  const tags = await axios
    .get(`${process.env.NEXTAUTH_URL}/api/tags`)
    .then((r) => r.data);

  return {
    props: {
      session,
      medias,
      categories,
      tags,
    },
  };
}

export default PostEdit;
