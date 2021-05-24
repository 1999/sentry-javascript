import Layout from '../components/Layout';

const ButtonPage = (): JSX.Element => (
  <Layout title="Home | Next.js + TypeScript Example">
    <button
      type="button"
      onClick={() => {
        throw new Error('Sentry Frontend Error');
      }}
    >
      Throw Error
    </button>
  </Layout>
);

export default ButtonPage;
