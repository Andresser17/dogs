import { useEffect } from "react";
// Helpers
import key from "../helpers/key";
// Styles
import styles from "./Select.module.css";

function Select({ options, id, selected, setSelected }) {
  const mapped = options.map((o) => (
    <option key={key(o.text)} value={o.value}>
      {o.text}
    </option>
  ));

  // set default value
  useEffect(() => {
    if (!selected[id] || selected[id].length === 0) {
      options[0].value
        ? setSelected((prev) => ({ ...prev, [id]: options[0].value }))
        : setSelected((prev) => ({ ...prev, [id]: "default" }));
    }
  }, [id, selected, options, setSelected]);

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
