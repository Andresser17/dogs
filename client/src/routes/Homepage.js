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
            Find your favorites dog breeds
          </span>
          <p>Free today and forever</p>
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
