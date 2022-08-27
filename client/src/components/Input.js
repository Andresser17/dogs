import { useState } from "react";
import styles from "./Input.module.css";

function Input({ text, id, placeholder, required, getData }) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState({ code: 0, message: "" });

  const handleChange = (e) => {
    const mergeStatus = (newStatus) =>
      setStatus((prev) => ({ ...prev, ...newStatus }));
    const newValue = e.target.value;

    getData(newValue, mergeStatus);
    setValue(newValue);
  };

  return (
    <label className={`${styles["label"]}`} htmlFor={id}>
      <span className={styles["title"]}>{text}</span>

      <input
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        id={id}
        className={`${styles["input"]} tertiary`}
        required={required}
      />

      <span
        className={`${styles["description"]} ${
          status.message.length > 0 && status.code === 1
            ? "success"
            : ""
        } ${
          status.message.length > 0 && status.code === 2
            ? "danger"
            : ""
        }`}
      >
        {status.code > 0 && status.message.length > 0 && status.message}
      </span>
    </label>
  );
}

export default Input;
