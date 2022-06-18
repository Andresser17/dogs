import { useState, useEffect } from "react";
// Components
import SearchInput from "../components/SearchInput";
import Select from "../components/Select";
import Pagination from "../components/Pagination";
import Item from "../components/Item";
// Styles
import styles from "./DogList.module.css";

function Filters({ onFilters }) {
  // breed come from api or added by user
  const origin = [
    { text: "Existence", value: "api" },
    { text: "Created by user", value: "db" },
  ];
  // Filter by temperament
  // Fill this temp with temperament from DB;
  const [temp, setTemp] = useState([{ text: "", value: "" }]);
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

      setTemp(() => [{ text: "Temperament", value: "default" }, ...mapped]);
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

function Items({ dogs }) {
  const mapped =
    dogs && dogs.length > 0 ? (
      dogs.map((d) => <Item key={d.id} dog={d} />)
    ) : (
      <div></div>
    );

  return <div className={styles["items"]}>{mapped}</div>;
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
        `${process.env.REACT_APP_API}/dogs?name=${filters.searchInput}&limit=8&page=${selectedPage}&origin=${filters.origin}&sort=${filters.sort}&order=${filters.order}&temp=${filters.temp}`
      );

      const data = await response.json();
      setDogList(() => data);
    };
    getDogs();
  }, [selectedPage, filters]);

  return (
    <div id="search" className={`${styles["container"]} dark`}>
      <Filters onFilters={setFilters} />
      <Items dogs={dogList?.data} />
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
