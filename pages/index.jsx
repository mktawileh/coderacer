import React from "react";
import Page from "../view/Page.jsx";
import Link from "next/link";
import SideBar from "../view/SideBar";
import RecentRaces from "../view/RecentRaces.jsx";
import { userAgent } from "next/server";

export async function getServerSideProps({ req, res }) {
  return {
    props: {
      value: 15,
    },
  };
}

export default function Main({ userState }) {
  const [user, setUser] = userState;
  return (
    <Page sideBar={<SideBar />}>
      <div className="row p-3 pt-0">
        <div className="box purple">
          <h3 className="text-center mb-5">Comming Soon! 😁</h3>
          <div className="row">
            <div className="col-md-6">
              <h6 className="info">New languages</h6>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <small>Javascript 😎</small>
                </li>
                <li className="list-group-item">
                  <small>PHP</small>
                </li>
                <li className="list-group-item">
                  <small>Maybe Java</small>
                </li>

                <li className="list-group-item">
                  <small>Not Python 😬..</small>
                </li>
              </ul>
            </div>
            <div className="col-md-6">
              <h6 className="info ">New Features</h6>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <small>Dark theme 🖤</small>
                </li>
                <li className="list-group-item">
                  <small>Death Mode 💀</small>
                </li>
                <li className="list-group-item">
                  <small>More and more features to come 😉..</small>
                </li>
                <li className="list-group-item">
                  <small>
                    Oh yeah.. and a lot of bugs fixing i'm pretty sure 🤣
                  </small>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="boxs text-center">
        <h6>
          Increase your typing speed along with your coding skills of the
          programming language you like 😃
        </h6>
        <small>
          Type and learn coding tips and tricks at the same time! 😎
        </small>
      </div>
      <div className="row mt-3">
        <div className="col-md-6">
          <div className="box h-h">
            <div className="row w-h">
              <div className="col-7">
                <p>Improve your typing 😏</p>
                <Link href="/race">
                  <button className="btn btn-secondary btn-lg">Practice</button>
                </Link>
              </div>
              <div className="col-5">
                <div className="image-icon">
                  <img src={"/imgs/practice.jpg"} alt="practice your self" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="box ">
            <div className="row">
              <div className="col-7">
                {user.username ? (
                  <>
                    <p>Challenge your friends! 😉</p>
                    <Link href="/race/with-friends">
                      <button className="btn btn-primary btn-lg">
                        Race your friends
                      </button>
                    </Link>
                  </>
                ) : (
                  <>
                    <p>
                      Create a new accout so you can challenge your friends! 😉
                    </p>
                    <Link href="/register">
                      <button className="btn btn-primary btn-lg">
                        Create an account
                      </button>
                    </Link>
                  </>
                )}
              </div>
              <div className="col-5">
                <div className="image-icon">
                  <img src={"/imgs/with-friends.png"} alt="race you friends" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RecentRaces />
    </Page>
  );
}
