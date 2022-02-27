import {
  faBars,
  faCog,
  faCommentAlt,
  faEdit,
  faFile,
  faGauge,
  faPhotoFilm,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Container } from 'react-bootstrap';
import styles from '../styles/Admin.module.scss';
import Avatar from './Avatar';

const Admin = ({ children, active, title, user }) => {
  const { data: session } = useSession();

  const pages = [
    { label: 'Dashboard', icon: faGauge, url: '/admin' },
    {
      label: 'Posts',
      icon: faEdit,
      url: '/admin/posts',
      children: [
        { label: 'All Post', url: '/admin/posts' },
        { label: 'Add Post', url: '/admin/posts/post-edit' },
        { label: 'Categories', url: '/admin/posts/categories' },
        { label: 'Tags', url: '/admin/posts/tags' },
      ],
    },
    { label: 'Media', icon: faPhotoFilm, url: '/admin/media' },
    {
      label: 'Pages',
      icon: faFile,
      url: '/admin/pages',
      children: [
        { label: 'All Pages', url: '/admin/pages' },
        { label: 'Add Page', url: '/admin/pages/page-edit' },
      ],
    },
    { label: 'Comments', icon: faCommentAlt, url: '/admin/comments' },
    { label: 'Menus', icon: faBars, url: '/admin/menus' },
    {
      label: 'Users',
      icon: faUsers,
      url: '/admin/users',
      children: [
        { label: 'All Users', url: '/admin/users' },
        { label: 'My Profile', url: '/admin/users/profile' },
      ],
    },
    { label: 'Settings', icon: faCog, url: '/admin/settings' },
  ];

  return (
    <div className={styles.admin}>
      <div className={styles.adminNav}>
        <ul className={styles.adminMenu}>
          {pages.map((page) => (
            <li
              key={page.label}
              className={active === page.label ? styles.active : ''}
            >
              <Link href={page.url}>
                <a>
                  <FontAwesomeIcon icon={page.icon} />
                  <span className={styles.label}>{page.label}</span>
                </a>
              </Link>
              {page.children && page.children.length ? (
                <ul className={styles.adminSubMenu}>
                  {page.children.map((item) => (
                    <li key={`sub-${item.label}`}>
                      <Link href={item.url}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.mainbar}>
        <header className={styles.topbar}>
          <Container fluid>
            <div className="flex">
              <h1 className={styles.adminTitle}>{title} - QPress</h1>
              <button
                onClick={() => signOut()}
                style={{
                  border: 'none',
                  padding: 0,
                  backgroundColor: 'transparent',
                }}
              >
                <Avatar user={session?.user} />
              </button>
            </div>
          </Container>
        </header>
        <div className={styles.childbar}>
          <Container fluid>{children}</Container>
        </div>
      </div>
    </div>
  );
};

export default Admin;
