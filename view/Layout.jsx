import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import MastHead from "./MastHead.jsx";
import Loader from "./components/Loader";
import Footer from "./Footer";

function Layout({ children, userState, titleState }) {
  const router = useRouter();
  const [user, setUser] = userState;
  const [pageTitle, setTitle] = titleState;
  const [loading, setLoading] = useState(true);
  const [loadingPage, setLoadingPage] = useState(false);
  useEffect(() => {
    // Handle loading pages.
    const handleStart = (url) => {
      setTitle("");
      if (
        url.match(/(.*?)(?=\?|$)/)[0] != router.asPath.match(/(.*?)(?=\?|$)/)[0]
      )
        setLoadingPage(true);
    };
    const handleComplete = () => setLoadingPage(false);
    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    // Check the auth of the user
    const check = async () => {
      const res = await axios.get("/api/auth/check");
      if (res.status == 200 && res.data.status) {
        setUser(res.data.user);
      }
      setLoading(false);
    };
    check();

    return () => {
      router.events.off("routerChangeStart", handleStart);
      router.events.off("routerChangeComplete", handleComplete);
      router.events.off("routerChangeError", handleComplete);
    };
  }, []);

  function handleLogout() {
    setUser({});
    axios.post("/api/auth/logout");
    router.push("/");
  }

  const title = `CodeRacer 😎` + (pageTitle ? " | " + pageTitle : "");
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="Improve your coding and typing skills! Play against your friends, or practice to increase your typing speed in the programming language you love!. Type and learn coding tips and tricks!"
        />
        <meta
          name="keywords"
          content="coderacer, typing, typing test, programming languages, programming language, cpp, c#, java, javascript,php, nodejs, js,typescript, wpm, cwpm, typing software, algorithms, new, game, typing game, games for programmers, best typing website, learn coding, learn programming, free typing, free website, free coding website, coding website, racer, racing your friends, race a friend"
        />
        <meta
          httpEquiv="content-type"
          content="text/html; charset=utf-8"
        ></meta>
        <meta name="author" content="Mohamed Tawileh" />
        <link rel="shortcut icon" href={"/favicon.ico"} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      {loading ? (
        <Loader />
      ) : (
        <div className="page-container">
          <MastHead onLogout={handleLogout} userState={userState} />
          {loadingPage ? <Loader /> : children}
          <Footer />
        </div>
      )}
      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={"light"}
      />
    </>
  );
}

export default Layout;
