import { useEffect } from "react";
// Helpers
import key from "../helpers/key";
// Styles
import styles from "./Select.module.css";

function Select({ options, id, setSelected }) {
  const mapped = options.map((o) => (
    <option key={key(o.text)} value={o.value}>
      {o.text}
    </option>
  ));

  // set default value
  useEffect(() => {
    setSelected((prev) => ({ ...prev, [id]: options[0].value }));
  }, []);

  return (
    <select
      onChange={(e) =>
        setSelected((prev) => ({ ...prev, [id]: e.target.value }))
      }
      className={`${styles["select"]} dark`}
    >
      {mapped}
    </select>
  );
}

export default Select;
