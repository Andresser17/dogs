import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./DogDetails.module.css";

function DetailsDescrip({ head, descrip }) {
  return (
    <div className={styles["details-descrip"]}>
      <span className={`${styles["details-title"]} primary`}>{head}</span>
      <span>{descrip}</span>
    </div>
  );
}

function DogDetails() {
  const { breedId } = useParams();
  const [dog, setDog] = useState({});
  const temperament = dog.temperament ? (
    dog.temperament.split(", ").map((t) => <li key={t}>{t}</li>)
  ) : (
    <li></li>
  );

  useEffect(() => {
    const getData = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API}/dogs/${breedId}`
      );
      const data = await response.json();

      setDog(data);
    };
    getData();
  }, [breedId]);

  return (
    <div className={`${styles["container"]} secondary`}>
      <div className={`${styles["wrapper"]} dark`}>
        <div className={styles["image-cont"]}>
          <div className={styles["image-wrapper"]}>
            <img alt={dog.name} src={dog.image} />
          </div>
        </div>
        <div className={styles["details"]}>
          <h2>{dog.name}</h2>
          <DetailsDescrip head="Weight" descrip={dog.weight} />
          <DetailsDescrip head="Height" descrip={dog.height} />
          <DetailsDescrip head="Life Expectation" descrip={dog.lifeSpan} />
          <DetailsDescrip head="Breed Group" descrip={dog.breedGroup} />

          <ul className={`${styles["temp-list"]} secondary`}>
            <span className={`primary`}>Temperament </span>
            {temperament}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DogDetails;
