import { useState } from "react";
import styles from "./InputTag.module.css";
// Icons
import { ReactComponent as ErrorIcon } from "../icons/error-icon.svg";

function Tag({ text, close }) {
  return (
    <span className={`${styles["tag"]} dark`}>
      {text}
      {/* close tag */}
      <ErrorIcon onClick={close} />
    </span>
  );
}

function Tags({ tags, deleteTag }) {
  const mapped = tags.map((tag, i) => (
    <Tag
      key={`${tag.replaceAll(" ", "-")}-${i}`}
      text={tag}
      close={() => deleteTag(i)}
    />
  ));

  return mapped;
}

function InputTag({
  id,
  placeholder,
  text,
  required,
  getInput,
  getTags,
  getRef,
}) {
  const [value, setValue] = useState("");
  const [tags, setTags] = useState([]);
  const [status, setStatus] = useState({ code: 0, message: "" });

  const handleChange = (e) => {
    getInput(e.target.value, mergeData);
    setValue(e.target.value);
  };

  const handleTagClose = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    // Delete tag in parent state
    getTags([...newTags], mergeData);
  };

  const mergeData = (newStatus, newValue) => {
    setStatus((prev) => ({ ...prev, ...newStatus }));
    if (!newValue || newValue.length === 0) return;
    setValue(newValue);
  };

  // add tag when user click enter
  const addTag = ({ key }) => {
    if (key === "Enter") {
      if (value.length === 0) return;
      if (status.code === 2) return;
      setTags([...tags, value]);
      getTags([...tags, value]);
      setValue("");
    }
  };

  return (
    <label className={styles["container"]} htmlFor={id}>
      <span className={styles["label"]}>{text}</span>
      <div className={`${styles["input-cont"]} tertiary`}>
        <Tags tags={tags} deleteTag={handleTagClose} />
        <input
          ref={getRef}
          placeholder={placeholder}
          onKeyPress={addTag}
          value={value}
          onChange={handleChange}
          className={styles["input"]}
          id={id}
          required={required}
        />
      </div>
      <span
        className={`${styles["description"]} ${
          status.message.length > 0 && status.code === 1 ? "success" : ""
        } ${status.message.length > 0 && status.code === 2 ? "danger" : ""}`}
      >
        {status.code > 0 && status.message.length > 0 && status.message}
      </span>
    </label>
  );
}

export default InputTag;
