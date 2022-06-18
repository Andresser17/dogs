import { useState, useEffect } from "react";
// Icons
import { ReactComponent as ArrowNext } from "../icons/arrow-next.svg";
import { ReactComponent as ArrowPrevious } from "../icons/arrow-previous.svg";
// Helpers
import key from "../helpers/key";
// Styles
import styles from "./Pagination.module.css";

function Button({ text, value, onSelectedPage, isSelected, children }) {
  return (
    <li
      onClick={() => onSelectedPage(value)}
      className={`${children ? styles["arrow-button"] : styles["button"]} ${
        isSelected === text ? "primary" : ""
      }`}
    >
      {children ? children : text}
    </li>
  );
}

function Pagination({ maxPage = 1, next, previous, onSelectedPage, selected }) {
  const [pag, setPag] = useState([]);
  const [pages, setPages] = useState(4);
  const [resolution, setResolution] = useState(0);
  const mapped =
    pag.length > 0 ? (
      pag.map((p) => {
        if (p.children)
          return (
            <Button
              value={p.value}
              onSelectedPage={onSelectedPage}
              isSelected={selected}
              key={key(p.text)}
            >
              {p.children}
            </Button>
          );

        return (
          <Button
            text={p.text}
            value={p.value}
            onSelectedPage={onSelectedPage}
            isSelected={selected}
            key={key(p.text)}
          />
        );
      })
    ) : (
      <li></li>
    );

  // resize pagination when resolution get bigger
  useEffect(() => {
    if (resolution <= 640) {
      setPages(4);
    }

    // sm
    if (resolution >= 640) {
      setPages(8);
    }

    // md
    if (resolution >= 768) {
      setPages(10);
    }
  }, [resolution]);

  // get document resolution
  useEffect(() => {
    if (resolution === 0) setResolution(document.body.clientWidth);

    const getResolution = () => {
      setResolution(document.body.clientWidth);
    };
    window.addEventListener("resize", getResolution);

    return () => {
      window.removeEventListener("resize", getResolution);
    };
  }, [resolution]);

  // Map maxPage to an array of int
  useEffect(() => {
    let mapped = [];

    for (let i = 0; i <= maxPage; i++) {
      if (i === pages + 1) {
        mapped = [
          ...mapped,
          {
            children: <ArrowNext className={styles["arrow"]} />,
            text: "Next",
            value: previous?.page ? next?.page : selected,
          },
        ];
        break;
      }

      if (i === 0) {
        mapped = [
          ...mapped,

          {
            children: <ArrowPrevious className={styles["arrow"]} />,
            text: "Previous",
            value: previous?.page ? previous?.page : selected,
          },
        ];
        continue;
      }

      mapped = [...mapped, { text: i, value: i }];
    }

    setPag(mapped);
  }, [pages, maxPage, next, previous, selected]);

  return <ul className={`${styles["pagination"]} secondary`}>{mapped}</ul>;
}

export default Pagination;
