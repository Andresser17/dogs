import { useState, useEffect, useRef } from "react";
// Icons
import { ReactComponent as SearchIcon } from "../icons/search-icon.svg";
// Styles
import styles from "./SearchInput.module.css";

function SearchInput({ id, setFilter }) {
  const [value, setValue] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const inputRef = useRef();

  // add filter-input-focus class to label
  useEffect(() => {
    const addClass = () =>
      document.activeElement.id === inputRef.current.id && setIsFocus(true);
    const removeClass = () => setIsFocus(false);
    document.addEventListener("focusin", addClass);
    document.addEventListener("focusout", removeClass);

    return () => {
      document.removeEventListener("focusin", addClass);
      document.removeEventListener("focusout", removeClass);
    };
  }, []);

  // pass user input to parent
  useEffect(() => {
    setFilter((prev) => ({ ...prev, [id]: value }));
  }, [value, id, setFilter]);

  return (
    <label
      className={`${styles["input"]} ${
        isFocus ? styles["input-focus"] : ""
      } dark`}
      htmlFor="search-breed"
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        ref={inputRef}
        id="search-breed"
      />
      <SearchIcon className={styles["search-icon"]} />
    </label>
  );
}

export default SearchInput;
