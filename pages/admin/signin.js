import {
  getProviders,
  signIn,
  getSession,
  getCsrfToken,
} from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
const Signin = ({ providers, csrfToken }) => {
  return (
    <>
      <Head>
        <title>Sign In - Q Press</title>
      </Head>
      <div className="fixedWBox">
        <div className="centerBox">
          <div className="roundLogo">
            <Image
              src="/img/logo-120.png"
              alt="QPRESS"
              width="60"
              height="60"
            />
          </div>
          <div className="acountBox">
            <h4>Sign In</h4>
            <div className="email-form">
              <form method="post" action="/api/auth/signin/email">
                <input name="csrfToken" type="hidden" value={csrfToken} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Your Email"
                />
                <button type="submit" className="btn btn-block">
                  Sign In
                </button>
              </form>
            </div>
            <div className="otherSignIn">
              {Object.values(providers).map((provider) => {
                if (provider.id === 'email') {
                  return;
                } else {
                  return (
                    <div key={provider.name}>
                      <button
                        className={`btn btn-block btn-${provider.id}`}
                        onClick={() => signIn(provider.id)}
                      >
                        Sign In with {provider.name}
                      </button>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(ctx) {
  const { req, res } = ctx;
  const session = await getSession(ctx);

  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: `/admin`,
      },
    };
  }

  const csrfToken = await getCsrfToken(ctx);
  const providers = await getProviders(ctx);

  return {
    props: {
      providers,
      csrfToken,
    },
  };
}

export default Signin;
