import { useState, useRef, useEffect } from "react";
// icons
import { ReactComponent as SearchIcon } from "./icons/search-icon.svg";
import { ReactComponent as ExternalLinkIcon } from "./icons/external-link-icon.svg";
// Styles
import styles from "./DogList.module.css";
const key = (text) => String(text).replaceAll(" ", "-");

function Select({ options }) {
  const mapped = options.map((o) => (
    <option key={key(o.text)} value={o.value}>
      {o.text}
    </option>
  ));

  return <select className={`${styles["select"]} dark`}>{mapped}</select>;
}

function Filter() {
  const [isFocus, setIsFocus] = useState(false);
  const inputRef = useRef();

  // breed come from api or added by user
  const createdAndAPI = [
    { text: "API", value: "api" },
    { text: "Created by user", value: "created" },
  ];
  // Filter by temperament
  // Fill this temp with temperament from DB;
  const temp = [
    { text: "Alert", value: "alert" },
    { text: "Cheerful", value: "cheerful" },
    { text: "Companionable", value: "companionable" },
  ];
  // sort by alphabetical order or weight
  const sort = [
    { text: "Alphabetical order", value: "alpha-order" },
    { text: "Weight", value: "weight" },
  ];
  const order = [
    { text: "Ascendant", value: "asc" },
    { text: "Descendant", value: "desc" },
  ];

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

  return (
    <div className={`${styles["filter"]} secondary`}>
      <Select options={createdAndAPI} />
      <Select options={temp} />
      <Select options={sort} />
      <Select options={order} />
      <label
        className={`${styles["filter-input"]} ${
          isFocus ? styles["filter-input-focus"] : ""
        } dark`}
        htmlFor="search-breed"
      >
        <input ref={inputRef} id="search-breed" />
        <SearchIcon className={styles["filter-search-icon"]} />
      </label>
    </div>
  );
}

function DogBreed({ data }) {
  return (
    <tr className={`${styles["dog-breed"]} dark`}>
      <td className={styles["breed-img-cont"]}>
        <a href={`/dogs/${data.id}`}>
          <img alt={data.name} src={data.image} />
        </a>
      </td>
      <td>
        <a className={styles["external-link"]} href={`/dogs/${data.id}`}>
          {data.name}
          <ExternalLinkIcon className={styles["external-link-icon"]} />
        </a>
      </td>
      <td>{data.temperament}</td>
      <td>{data.weight}</td>
    </tr>
  );
}

function DogBreedList({}) {
  const dogBreeds = [
    {
      id: 262,
      name: "Xoloitzcuintli",
      weight: "4kg - 14kg",
      temperament:
        "Cheerful, Alert, Companionable, Intelligent, Protective, Calm",
      image: "https://cdn2.thedogapi.com/images/HkNS3gqEm.jpg",
    },
    {
      id: 264,
      name: "Yorkshire Terrier",
      weight: "2kg - 3kg",
      temperament: "Bold, Independent, Confident, Intelligent, Courageous",
      image: "https://cdn2.thedogapi.com/images/B12BnxcVQ.jpg",
    },
  ];

  return (
    <table className={`${styles["dog-breed-list"]} secondary`}>
      <thead className="primary">
        <tr>
          <td></td>
          <td>Name</td>
          <td>Temperament</td>
          <td>Weight</td>
        </tr>
      </thead>
      <tbody>
        <DogBreed data={dogBreeds[0]} />
        <DogBreed data={dogBreeds[0]} />
        <DogBreed data={dogBreeds[0]} />
        <DogBreed data={dogBreeds[0]} />
        <DogBreed data={dogBreeds[0]} />
        <DogBreed data={dogBreeds[0]} />
        <DogBreed data={dogBreeds[0]} />
        <DogBreed data={dogBreeds[0]} />
      </tbody>
    </table>
  );
}

function Pagination({ maxPage, selected }) {
  const pag = maxPage.map((p) => {
    if (selected === p)
      return (
        <li className="primary" key={key(p)}>
          {p}
        </li>
      );

    return <li key={key(p)}>{p}</li>;
  });

  return (
    <div className={styles["pagination-cont"]}>
      <ul className={`${styles["pagination"]} secondary`}>{pag}</ul>
    </div>
  );
}

function DogList() {
  return (
    <div id="search" className={`${styles["dog-list-cont"]} dark`}>
      <Filter />
      <DogBreedList />
      <Pagination
        selected={1}
        maxPage={["Previous", 1, 2, 3, 4, 5, , 6, 7, 8, "Next"]}
      />
    </div>
  );
}

export default DogList;
