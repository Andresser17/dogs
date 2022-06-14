import { useState, useRef, useEffect } from "react";
// icons
import { ReactComponent as SearchIcon } from "./icons/search-icon.svg";
import { ReactComponent as ExternalLinkIcon } from "./icons/external-link-icon.svg";
// Styles
import styles from "./DogList.module.css";
const key = (text) => String(text).replaceAll(" ", "-");

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
      className={`${styles["filter-input"]} ${
        isFocus ? styles["filter-input-focus"] : ""
      } dark`}
      htmlFor="search-breed"
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        ref={inputRef}
        id="search-breed"
      />
      <SearchIcon className={styles["filter-search-icon"]} />
    </label>
  );
}

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

function Filters({ onFilters }) {
  // breed come from api or added by user
  const origin = [
    { text: "Existence", value: "api" },
    { text: "Created by user", value: "db" },
  ];
  // Filter by temperament
  // Fill this temp with temperament from DB;
  const [temp, setTemp] = useState([{ text: "Temperament", value: "default" }]);
  // sort by alphabetical order or weight
  const sort = [
    { text: "Alphabetical order", value: "id" },
    { text: "Weight", value: "weight" },
  ];
  const order = [
    { text: "Ascendant", value: "asc" },
    { text: "Descendant", value: "desc" },
  ];

  // fetch all temperament options
  useEffect(() => {
    const getData = async () => {
      const response = await fetch(`${process.env.REACT_APP_API}/temperaments`);
      const data = await response.json();
      const mapped = data.map((t) => ({ text: t.name, value: t.name }));

      setTemp(prev => [...prev, ...mapped]);
    };
    getData();
  }, []);

  return (
    <div className={`${styles["filter"]} secondary`}>
      <Select id="origin" setSelected={onFilters} options={origin} />
      <Select id="temp" setSelected={onFilters} options={temp} />
      <Select id="sort" setSelected={onFilters} options={sort} />
      <Select id="order" setSelected={onFilters} options={order} />
      <SearchInput id="searchInput" setFilter={onFilters} />
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
        mapped = [
          ...mapped,

          {
            text: "Previous",
            value: previous?.page ? previous?.page : selected,
          },
        ];
        continue;
      }

      mapped = [...mapped, { text: i, value: i }];

      if (i === maxPage) {
        mapped = [...mapped, { text: "Next", value: next.page }];
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
  const [filters, setFilters] = useState({
    origin: "",
    temp: "",
    sort: "",
    order: "",
    searchInput: "",
  });

  // get data from backend api
  useEffect(() => {
    const getDogs = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API}/dogs?limit=8&page=${selectedPage}&origin=${filters.origin}&sort=${filters.sort}&order=${filters.order}&temp=${filters.temp}`
      );
      const data = await response.json();
      setDogList(data);
    };
    getDogs();
  }, [selectedPage, filters]);

  // // search by name
  // useEffect(() => {
  //   const getDogs = async () => {
  //     const response = await fetch(
  //       `${process.env.REACT_APP_API}/dogs?limit=8&page=${selectedPage}&origin=${filters.origin}`
  //     );
  //     const data = await response.json();
  //     setDogList(data);
  //   };
  //   getDogs();
  // }, [selectedPage, filters]);

  return (
    <div id="search" className={`${styles["dog-list-cont"]} dark`}>
      <Filters onFilters={setFilters} />
      <DogBreedList dogs={dogList?.data} />
      <Pagination
        onSelectedPage={setSelectedPage}
        selected={selectedPage}
        next={dogList?.next}
        previous={dogList?.previous}
        maxPage={dogList?.maxPage}
      />
    </div>
  );
}

export default DogList;
