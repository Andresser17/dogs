import { useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Topbar.module.css";
import { ReactComponent as LogoIcon } from "./icons/logo-icon.svg";

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

function Menu() {
  return (
    <nav className={styles["menu-cont"]}>
      <ul>
        <HashLink pathname="/" hashLink="#home" text="Home" />
        <HashLink pathname="/" hashLink="#search" text="Search" />
        <HashLink pathname="/" hashLink="#create" text="Create" />
      </ul>
    </nav>
  );
}

function Topbar() {
  return (
    <div className={styles["top-panel"]}>
      <div className={styles["logo-cont"]}>
        <LogoIcon className={`${styles["logo-icon"]} warning`} />
        <h1>Henry Dogs</h1>
      </div>
      <Menu />
    </div>
  );
}

export default Topbar;
