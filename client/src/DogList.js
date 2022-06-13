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

function DogBreed({ dog }) {
  return (
    <tr className={`${styles["dog-breed"]} dark`}>
      <td className={styles["breed-img-cont"]}>
        <a href={`/dogs/${dog.id}`}>
          <img alt={dog.name} src={dog.image} />
        </a>
      </td>
      <td>
        <a className={styles["external-link"]} href={`/dogs/${dog.id}`}>
          {dog.name}
          <ExternalLinkIcon className={styles["external-link-icon"]} />
        </a>
      </td>
      <td>{dog.temperament}</td>
      <td>{dog.weight}</td>
    </tr>
  );
}

function DogBreedList({ dogs }) {
  const mapped =
    dogs && dogs.length > 0 ? (
      dogs.map((d) => <DogBreed key={d.id} dog={d} />)
    ) : (
      <tr></tr>
    );

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
      <tbody>{mapped}</tbody>
    </table>
  );
}

function Pagination({ maxPage, next, previous, onSelectedPage, selected }) {
  const [pag, setPag] = useState([]);
  const mapped =
    pag.length > 0 ? (
      pag.map((p) => {
        return (
          <li
            onClick={() => onSelectedPage(p.value)}
            className={selected === p.text ? "primary" : ""}
            key={key(p.text)}
          >
            {p.text}
          </li>
        );
      })
    ) : (
      <li></li>
    );

  // Map maxPage to an array of int
  useEffect(() => {
    let mapped = [];

    for (let i = 0; i <= maxPage; i++) {
      if (i === 0) {
        mapped = [...mapped, { text: "Next", value: next.page }];
        continue;
      }

      mapped = [...mapped, { text: i, value: i }];

      if (i === maxPage) {
        mapped = [
          ...mapped,
          {
            text: "Previous",
            value: previous?.page ? previous?.page : selected,
          },
        ];
      }
    }

    setPag(mapped);
  }, [maxPage, next, previous, selected]);

  return (
    <div className={styles["pagination-cont"]}>
      <ul className={`${styles["pagination"]} secondary`}>{mapped}</ul>
    </div>
  );
}

function DogList() {
  const [selectedPage, setSelectedPage] = useState(1);
  const [dogList, setDogList] = useState({});

  useEffect(() => {
    const getDogs = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API}/dogs?limit=8&page=${selectedPage}`
      );
      const data = await response.json();
      setDogList(data);
    };
    getDogs();
  }, [selectedPage]);

  return (
    <div id="search" className={`${styles["dog-list-cont"]} dark`}>
      <Filter />
      <DogBreedList dogs={dogList.api?.data} />
      <Pagination
        onSelectedPage={setSelectedPage}
        selected={selectedPage}
        next={dogList.api?.next}
        previous={dogList.api?.previous}
        maxPage={dogList.api?.maxPage}
      />
    </div>
  );
}

export default DogList;
