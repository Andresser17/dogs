import { useRef, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Topbar.module.css";
import { ReactComponent as LogoIcon } from "../icons/logo-icon.svg";

function HashLink({ pathname, hashLink, text }) {
  const location = useLocation();
  const linkRef = useRef();

  const clickLink = (ref) => {
    setTimeout(() => {
      ref.current.click();
    }, 300);
  };

  return (
    <li>
      {location.pathname === pathname ? (
        <a ref={linkRef} href={hashLink}>
          {text}
        </a>
      ) : (
        <Link onClick={() => clickLink(linkRef)} to={pathname}>
          {text}
        </Link>
      )}
    </li>
  );
}

function Menu({ active }) {
  return (
    <nav
      className={`${styles["menu-cont"]} ${
        active ? styles["menu-cont-active"] : styles["menu-cont-inactive"]
      }`}
    >
      <ul>
        <HashLink pathname="/" hashLink="#home" text="Home" />
        <HashLink pathname="/" hashLink="#search" text="Search" />
        <HashLink pathname="/" hashLink="#create" text="Create" />
      </ul>
    </nav>
  );
}

function Topbar() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const listenScollbar = () => {
      if (window.scrollY > 100) setActive(true);
      else setActive(false);
    };
    window.addEventListener("scroll", listenScollbar);

    return () => {
      window.removeEventListener("scroll", listenScollbar);
    };
  }, []);

  return (
    <div
      className={`${styles["top-panel"]} ${
        active ? styles["top-panel-active"] : styles["top-panel-inactive"]
      }`}
    >
      <div
        className={`${styles["logo-cont"]} ${
          active ? styles["logo-cont-active"] : styles["logo-cont-inactive"]
        }`}
      >
        <LogoIcon className={`${styles["logo-icon"]}`} />
        <h1>Henry Dogs</h1>
      </div>
      <Menu active={active} />
    </div>
  );
}

export default Topbar;
