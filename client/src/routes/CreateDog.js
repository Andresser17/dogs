import { useState, useRef } from "react";
// Components
import InputTag from "../components/InputTag";
import Input from "../components/Input";
import MinMaxInput from "../components/MinMaxInput";
// helpers
import {
  validateName,
  validateWeight,
  validateHeight,
  validateLife,
  validateTemp,
} from "../helpers/validation";
// Styles
import styles from "./CreateDog.module.css";

function CreateDog() {
  const [values, setValues] = useState({
    name: "",
    weight: { min: 0, max: 0 },
    height: { min: 0, max: 0 },
    lifeExpectancy: { min: 0, max: 0 },
    inputTag: "",
    temperament: [],
  });
  const [status, setStatus] = useState({
    code: 0,
    message: "",
  });
  // Refs
  const inputTagRef = useRef();

  const handleInput = (data, setData, key) => {
    // Add validations
    let status;
    let newValue = "";

    if (key === "name") {
      status = validateName(data);
      if (status.code !== 2) newValue = data;
    }
    if (key === "weight") {
      status = validateWeight(data, setValues);
      if (status.code !== 2) newValue = data;
      else newValue = { min: 0, max: 0 };
    }
    if (key === "height") {
      status = validateHeight(data, setValues);
      if (status.code !== 2) newValue = data;
      else newValue = { min: 0, max: 0 };
    }

    if (key === "lifeExpectancy") {
      status = validateLife(data, setValues);
      if (status.code !== 2) newValue = data;
      else newValue = { min: 0, max: 0 };
    }

    if (key === "inputTag") {
      status = validateTemp(data, setValues);
      if (status.code !== 2) newValue = data;
    }

    setValues((prev) => ({ ...prev, [key]: newValue }));
    setData(status, data);
  };

  // get input tag when user press enter
  const handleTags = (newTags) =>
    setValues((prev) => ({ ...prev, temperament: newTags, inputTag: "" }));

  // send data to backend
  const sendFormData = async (e) => {
    e.preventDefault();

    // check that required values are not empty
    if (values.name.length === 0) return;
    if (values.weight.min === 0 || values.weight.max === 0) return;
    if (values.height.min === 0 || values.height.max === 0) return;
    if (values.lifeExpectancy.min === 0 || values.lifeExpectancy.max === 0)
      return;

    const response = await fetch(`${process.env.REACT_APP_API}/dogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: values.name,
        weight: `${values.weight.min}kg - ${values.weight.max}kg`,
        height: `${values.height.min}cm - ${values.height.max}cm`,
        lifeSpan: `${values.lifeExpectancy.min} - ${values.lifeExpectancy.max} years`,
        temperament: values.temperament,
      }),
    });
    const data = await response.json();

    if (response.status === 200)
      setStatus({ code: 1, message: "Successfuly created" });
    else setStatus({ code: 2, message: data.message });
  };

  // prevent submit form with enter when input tag is selected
  const handleKeyPress = (e) => {
    if (
      e.key === "Enter" &&
      document.activeElement.id === inputTagRef.current.id
    ) {
      e.preventDefault();
    }
  };

  return (
    <div id="create" className={`${styles["container"]} dark`}>
      <h2>Create a new dog breed</h2>

      <form
        onKeyPress={handleKeyPress}
        onSubmit={sendFormData}
        className={`${styles["form"]} secondary`}
      >
        {/* Message */}
        <div
          className={`${styles["form-message"]} ${
            status.code === 2 ? "danger" : "success"
          }`}
        >
          <span>{status.message}</span>
        </div>

        <div className={styles["input-cont"]}>
          <Input
            getData={(data, setData) => handleInput(data, setData, "name")}
            placeholder="Name..."
            text="Name *"
            id="name"
            required
          />
        </div>
        <div className={styles["input-cont"]}>
          <MinMaxInput
            getData={(data, setData) => handleInput(data, setData, "weight")}
            id="weight"
            text="Weight *"
            required
          />
        </div>
        <div className={styles["input-cont"]}>
          <MinMaxInput
            getData={(data, setData) => handleInput(data, setData, "height")}
            id="height"
            text="Height *"
            required
          />
        </div>
        <div className={styles["input-cont"]}>
          <MinMaxInput
            getData={(data, setData) =>
              handleInput(data, setData, "lifeExpectancy")
            }
            text="Life Expectancy *"
            id="life-expect"
            required
          />
        </div>
        <div className={styles["input-cont"]}>
          <InputTag
            getRef={inputTagRef}
            getInput={(data, setData) => handleInput(data, setData, "inputTag")}
            getTags={handleTags}
            text="Temperament"
            id="temperament"
            placeholder="Add one or more temperaments..."
          />
        </div>

        <button className={`${styles["submit-button"]} primary`}>Create</button>
      </form>
    </div>
  );
}

export default CreateDog;
