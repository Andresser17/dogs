import styles from "./Homepage.module.css";
import { ReactComponent as LogoIcon } from "./icons/logo-icon.svg";

function Menu({ links }) {
  const key = (l) => l.replace(" ", "-");
  const mapped = links.map((l) => (
    <li key={key(l.text)}>
      <a href={l.link}>{l.text}</a>
    </li>
  ));

  return (
    <nav className={styles["menu-cont"]}>
      <ul>{mapped}</ul>
    </nav>
  );
}

function Homepage() {
  const links = [
    { text: "Home", link: "#home" },
    { text: "Search", link: "#search" },
    { text: "Create", link: "#create" },
  ];

  return (
    <header id="home" className={styles["header"]}>
      {/* top panel */}
      <div className={styles["top-panel"]}>
        <div className={styles["logo-cont"]}>
          <LogoIcon className={`${styles["logo-icon"]} warning`} />
          <h1 >Henry Dogs</h1>
        </div>
        <Menu {...{ links }} />
      </div>
      {/* description text container */}
      <div className={styles["descrip-cont"]}>
        <div className={styles["descrip"]}>
          <span className={styles["descrip-title"]}>
            Unleash your keyboard’s superpower
          </span>
          <p className={styles}>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et
          </p>
        </div>
      </div>
    </header>
  );
}

export default Homepage;
