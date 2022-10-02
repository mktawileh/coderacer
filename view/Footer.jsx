import NavLink from "./components/NavLink";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className=" bottom">
          <div className="left">
            <div className="sections">
              <ul className="nav">
                <li className="nav-item">
                  <NavLink to="/about-the-author">About the author</NavLink>
                </li>
                {/* <li className="nav-item">
                  <NavLink to="/policy">Policy</NavLink>
                </li> */}
                <li className="nav-item">
                  <NavLink to="/terms-of-service">Terms of Service</NavLink>
                </li>
                {/* <li className="nav-item">
                  <NavLink to="/keyboard-shortcuts">Keyboard Shortcuts</NavLink>
                </li> */}
                <li className="nav-item">
                  <NavLink to="/about">
                    About <span className="purple bold">Code</span>Racer
                  </NavLink>
                </li>
              </ul>
            </div>
            <div className="mt-3 mx-3">
              © 2022 <b>CodeRacer, Website.</b>
            </div>
            <div className="mt-3 mx-3">
              Made with tea 💚 by{" "}
              <Link href="/about-the-author">Mohamed Tawileh</Link>
            </div>
          </div>

          <div className="right">
            <div className="logo">
              <span className="purple bold">Code</span>Racer
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
