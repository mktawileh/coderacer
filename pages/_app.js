// https://nextjs.org/docs/basic-features/built-in-css-support
// import "../public/main.css";
import "prismjs/themes/prism-okaidia.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../view/scss/main.scss";
import Layout from "../view/Layout";
import { useState } from "react";

// This default export is required in a new `pages/_app.js` file.
export default function CodeRacer({ Component, pageProps }) {
  const [user, setUser] = useState({});
  const [title, setTitle] = useState("");

  return (
    <Layout userState={[user, setUser]} titleState={[title, setTitle]}>
      <Component
        {...pageProps}
        userState={[user, setUser]}
        titleState={[title, setTitle]}
      />
    </Layout>
  );
}
