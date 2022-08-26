// Components
import DogList from "./DogList";
import CreateDog from "./CreateDog";
// Styles
import styles from "./Homepage.module.css";

function Header() {
  return (
    <header id="home" className={styles["header"]}>
      {/* description text container */}
      <div className={styles["descrip-cont"]}>
        <div className={styles["descrip"]}>
          <span className={styles["descrip-title"]}>
            Unleash your keyboard’s superpower
          </span>
          <p>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et
          </p>
        </div>
      </div>
    </header>
  );
}

function Homepage() {
  return (
    <>
      <Header />
      <DogList />
      <CreateDog />
    </>
  );
}

export default Homepage;
