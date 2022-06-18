import { Link } from "react-router-dom";
// Icons
import { ReactComponent as ExternalLinkIcon } from "../icons/external-link-icon.svg";
import { ReactComponent as DefaultImage } from "../icons/default-image.svg";
// Styles
import styles from "./Item.module.css";

function Item({ dog }) {
  const link = dog.created ? `created_${dog.id}` : dog.id;

  return (
    <div className={`${styles["container"]} secondary`}>
      {/* <div className={styles["img-cont"]}> */}
      <Link className={styles["external-link-image"]} to={`/details/${link}`}>
        {dog.image ? <img alt={dog.name} src={dog.image} /> : <DefaultImage />}
      </Link>
      {/* </div> */}
      <div className={styles["body"]}>
        <Link className={styles["external-link"]} to={`/details/${link}`}>
          {dog.name}
          <ExternalLinkIcon className={styles["external-link-icon"]} />
        </Link>
        <span className={styles["text-span"]}>Weight: {dog.weight}</span>
        <div className={`${styles["temp-cont"]} primary`}>
          <div className={styles["temp-title-cont"]}>
            <span className={styles["temp-title"]}>Temperament</span>
          </div>
          <span className={styles["temp"]}>
            {dog.temperament &&
              dog.temperament.split(", ").reduce((accum, item, i) => {
                if (i === 0) return item;
                if (i === 2) return `${accum}, ${item}...`;
                if (i >= 3) return accum;

                return `${accum}, ${item}`;
              }, "")}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Item;
