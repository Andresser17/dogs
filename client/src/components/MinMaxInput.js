import { useState } from "react";
import styles from "./MinMaxInput.module.css";

function MinMaxInput({ text, id, required, getData }) {
  const [values, setValues] = useState({ min: "", max: "" });
  const [status, setStatus] = useState({ code: 0, message: "" });

  const handleChange = (e, key) => {
    const mergeStatus = (newStatus) =>
      setStatus((prev) => ({ ...prev, ...newStatus }));
    const value = e.target.value <= 0 ? 0 : e.target.value;
    const newState = { ...values, [key]: Number(value) };

    getData(newState, mergeStatus);
    setValues(newState);
  };

  return (
    <div className={styles["container"]}>
      <span className={`${styles["label"]} ${styles["label-title"]}`}>
        {text}
      </span>

      <div className={styles["label-cont"]}>
        <label
          htmlFor={`min-${id}`}
          className={`${styles["input-cont"]} primary`}
        >
          <span className={styles["input-title"]}>Min:</span>
          <input
            id={`min-${id}`}
            className={styles["input"]}
            type="number"
            value={values.min}
            onChange={(e) => handleChange(e, "min")}
            required={required}
          />
        </label>

        <label
          htmlFor={`max-${id}`}
          className={`${styles["input-cont"]} tertiary`}
        >
          <span className={styles["input-title"]}>Max:</span>
          <input
            id={`max-${id}`}
            className={styles["input"]}
            type="number"
            value={values.max}
            onChange={(e) => handleChange(e, "max")}
            required={required}
          />
        </label>
      </div>

      <span
        className={`${styles["description"]} ${
          status.message.length > 0 && status.code === 1 ? "success" : ""
        } ${status.message.length > 0 && status.code === 2 ? "danger" : ""}`}
      >
        {status.code > 0 && status.message.length > 0 && status.message}
      </span>
    </div>
  );
}

export default MinMaxInput;
